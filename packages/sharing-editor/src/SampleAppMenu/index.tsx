import React from "react";
import { RiGithubFill } from "react-icons/ri";
import sampleAppManifests from "../sample-app-manifests.json"; // This file is generated by bin/gen-sample-app-manifests-json.ts at build time.
import { Link } from "react-router-dom";
import { URL_SEARCH_KEY_SAMPLE_APP_ID } from "../url";
import classNames from "classnames";
import logo from "../logo.svg";
import styles from "./index.module.scss";

function DisableableLink(
  props: React.ComponentProps<typeof Link> & { disabled?: boolean },
) {
  const { disabled, ...restProps } = props;
  return disabled ? <span {...restProps} /> : <Link {...restProps} />;
}

interface SampleAppMenuProps {
  currentSampleAppId: string | null;
}
function SampleAppMenu(props: SampleAppMenuProps) {
  const { currentSampleAppId } = props;

  return (
    <div className={styles.container}>
      <img src={logo} alt="stlite sharing logo" className={styles.logo} />
      <h2 className={styles.heading}>Samples</h2>
      <ol className={styles.list}>
        {sampleAppManifests.map((sampleAppManifest) => {
          const isActive = currentSampleAppId === sampleAppManifest.id;
          return (
            <DisableableLink
              key={sampleAppManifest.id}
              disabled={isActive}
              to={{
                search: `${URL_SEARCH_KEY_SAMPLE_APP_ID}=${sampleAppManifest.id}`,
              }}
            >
              <li
                className={classNames(styles.listItem, {
                  [styles.active]: isActive,
                })}
              >
                {sampleAppManifest.title}
              </li>
            </DisableableLink>
          );
        })}
      </ol>
      <div className={styles.footer}>
        <a
          href="https://github.com/whitphx/stlite"
          target="_blank"
          rel="noreferrer"
          className={styles.githubIconLink}
        >
          <RiGithubFill />
        </a>
      </div>
    </div>
  );
}

export default SampleAppMenu;
