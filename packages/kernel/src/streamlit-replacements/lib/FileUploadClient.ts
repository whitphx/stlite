/**
 * @license
 * Copyright 2018-2022 Streamlit Inc.
 * Copyright 2022 Yuichiro Tachibana
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CancelToken } from "axios"
import { SessionInfo } from "streamlit-browser/src/lib/SessionInfo"
import _ from "lodash"
import { BaseUriParts } from "streamlit-browser/src/lib/UriUtil"
import { FormDataEncoder, FormDataLike } from "form-data-encoder"
import { isValidFormId } from "streamlit-browser/src/lib/utils"
import { StliteKernel } from "../../kernel"

/** Common widget protobuf fields that are used by the FileUploadClient. */
interface WidgetInfo {
  id: string
  formId: string
}

interface Props {
  /** The app's SessionInfo instance. */
  sessionInfo: SessionInfo
  getServerUri: () => BaseUriParts | undefined
  csrfEnabled: boolean
  formsWithPendingRequestsChanged: (formIds: Set<string>) => void
}

/**
 * Handles uploading files to the server.
 */
export class FileUploadClient {
  private readonly sessionInfo: SessionInfo

  /**
   * Map of <formId: number of outstanding requests>. Updated whenever
   * a widget in a form creates are completes a request.
   */
  private readonly formsWithPendingRequests = new Map<string, number>()

  /**
   * Called when the set of forms that have pending file requests changes.
   */
  private readonly pendingFormUploadsChanged: (formIds: Set<string>) => void

  public constructor(props: Props) {
    this.pendingFormUploadsChanged = props.formsWithPendingRequestsChanged
    this.sessionInfo = props.sessionInfo
  }

  private kernel: StliteKernel | undefined
  public setKernel(kernel: StliteKernel) {
    this.kernel = kernel
  }

  /**
   * Upload a file to the server. It will be associated with this browser's sessionID.
   *
   * @param widget: the FileUploader widget that's doing the upload.
   * @param file: the files to upload.
   * @param onUploadProgress: an optional function that will be called repeatedly with progress events during the upload.
   * @param cancelToken: an optional axios CancelToken that can be used to cancel the in-progress upload.
   *
   * @return a Promise<number> that resolves with the file's unique ID, as assigned by the server.
   */
  public async uploadFile(
    widget: WidgetInfo,
    file: File,
    onUploadProgress?: (progressEvent: any) => void, // TODO
    cancelToken?: CancelToken // TODO
  ): Promise<number> {
    const form = new FormData()
    form.append("sessionId", this.sessionInfo.current.sessionId)
    form.append("widgetId", widget.id)
    form.append(file.name, file)

    this.offsetPendingRequestCount(widget.formId, 1)

    const encoder = new FormDataEncoder(form as unknown as FormDataLike)
    const bodyBlob = new Blob(encoder as unknown as BufferSource[], {
      type: encoder.contentType,
    })

    return bodyBlob.arrayBuffer().then((body) => {
      if (this.kernel == null) {
        throw new Error("Kernel not ready")
      }

      return this.kernel
        .sendHttpRequest({
          method: "POST",
          path: "/_stcore/upload_file",
          body,
          headers: { ...encoder.headers },
        })
        .then((response) => {
          const text = new TextDecoder().decode(response.body)
          if (typeof text === "number") {
            return text
          }
          if (typeof text === "string") {
            const parsed = parseInt(text, 10)
            if (!Number.isNaN(parsed)) {
              return parsed
            }
          }

          throw new Error(
            `Bad uploadFile response: expected a number but got '${text}'`
          )
        })
        .finally(() => this.offsetPendingRequestCount(widget.formId, -1))
    })
  }

  private getFormIdSet(): Set<string> {
    return new Set(this.formsWithPendingRequests.keys())
  }

  private offsetPendingRequestCount(formId: string, offset: number): void {
    if (offset === 0) {
      return
    }

    if (!isValidFormId(formId)) {
      return
    }

    const curCount = this.formsWithPendingRequests.get(formId) ?? 0
    const newCount = curCount + offset
    if (newCount < 0) {
      throw new Error(
        `Can't offset pendingRequestCount below 0 (formId=${formId}, curCount=${curCount}, offset=${offset})`
      )
    }

    const prevWidgetIds = this.getFormIdSet()

    if (newCount === 0) {
      this.formsWithPendingRequests.delete(formId)
    } else {
      this.formsWithPendingRequests.set(formId, newCount)
    }

    const newWidgetIds = this.getFormIdSet()
    if (!_.isEqual(newWidgetIds, prevWidgetIds)) {
      this.pendingFormUploadsChanged(newWidgetIds)
    }
  }
}
