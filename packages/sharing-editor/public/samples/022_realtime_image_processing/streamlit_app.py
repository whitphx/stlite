import streamlit as st

from streamlit_fesion import streamlit_fesion


st.title("Serverless real-time video filter")
st.info("""
    Every image processing is working on your browser, like all other _stlite_ features.\\
    Your video is **NEVER UPLOADED** to any remote servers!

    This sample uses [`streamlit-fesion`](https://github.com/whitphx/streamlit-fesion)
    custom component for the real-time image processing on WebAssembly!
""", icon="⚡")


def grayscale(input_image):
    # Ref: https://scikit-image.org/docs/0.15.x/auto_examples/color_exposure/plot_rgb_to_gray.html  # noqa: E501
    import skimage

    grayscale = skimage.color.rgb2gray(input_image)
    return skimage.color.gray2rgb(grayscale)


def sobel(input_image):
    # Ref: https://scikit-image.org/docs/0.15.x/auto_examples/color_exposure/plot_adapt_rgb.html  # noqa: E501
    from skimage import filters
    from skimage.color.adapt_rgb import adapt_rgb, each_channel
    from skimage.exposure import rescale_intensity

    @adapt_rgb(each_channel)
    def sobel_each(image):
        return filters.sobel(image)

    return rescale_intensity(1 - sobel_each(input_image))


def face_detection(input_image):
    # Ref: https://scikit-image.org/docs/0.15.x/auto_examples/applications/plot_face_detection.html  # noqa: E501
    # TODO: This function is inefficient because detector is loaded
    # TODO: in every frame. Create a cache mechanism.
    from skimage import data
    from skimage.draw import rectangle
    from skimage.feature import Cascade

    # Load the trained file from the module root.
    trained_file = data.lbp_frontal_face_cascade_filename()

    # Initialize the detector cascade.
    detector = Cascade(trained_file)

    detected = detector.detect_multi_scale(
        img=input_image,
        scale_factor=1.4,
        step_ratio=1,
        min_size=(60, 60),
        max_size=(322, 322),
    )

    for patch in detected:
        print(patch)
        rr, cc = rectangle(
            start=(patch["r"], patch["c"]),
            extent=(patch["height"], patch["width"]),
            shape=input_image.shape[:2],
        )
        input_image[rr, cc, 0] = 255

    return input_image


filter_type = st.radio("Filter", ["grayscale", "sobel", "face_detection"])
if filter_type == "grayscale":
    image_filter = grayscale
elif filter_type == "sobel":
    image_filter = sobel
elif filter_type == "face_detection":
    image_filter = face_detection
else:
    raise ValueError(f'Unexpected filter type "{filter_type}"')

streamlit_fesion(image_filter, key="example")
