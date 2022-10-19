"""
This sample code has been copied from
https://github.com/randyzwitch/streamlit-folium/blob/master/examples/streamlit_app.py
"""

import streamlit as st

st.set_page_config(page_title="streamlit-folium documentation")

page = st.sidebar.radio(
    "Select page", ["Home", "Bi-directional data model", "Plugin: Draw"], index=0
)

"# streamlit-folium"

if page == "Home":
    "streamlit-folium integrates two great open-source projects in the Python ecosystem: [Streamlit](https://streamlit.io) and [Folium](https://python-visualization.github.io/folium/)!"

    """
    Currently, there are two functions defined:

    - `st_folium()`: a bi-directional Component, taking a Folium/Branca object and plotting to the Streamlit app. Upon mount/interaction with the Streamlit app, st_folium() returns a Dict with selected information including the bounding box and items clicked on

    - `folium_static()`: takes a folium.Map, folium.Figure, or branca.element.Figure object and displays it in a Streamlit app.

    _Note: `folium_static()` is based on the `_repr_html()` representation created in Folium. This function should be a strict subset the of functionality of the newer `st_folium()` function._

    It is recommended that users switch to `st_folium()` as soon as possible, as `folium_static()` will likely be deprecated. If there is a reason why `folium_static()` needs to remain, please leave a [GitHub issue](https://github.com/randyzwitch/streamlit-folium/issues) describing your use-case.
    """


    "---"
    "### Basic `st_folium()` Example"

    with st.echo():

        import streamlit as st
        from streamlit_folium import st_folium
        import folium

        # center on Liberty Bell, add marker
        m = folium.Map(location=[39.949610, -75.150282], zoom_start=16)
        folium.Marker(
            [39.949610, -75.150282],
            popup="Liberty Bell",
            tooltip="Liberty Bell"
        ).add_to(m)

        # call to render Folium map in Streamlit
        st_data = st_folium(m, width = 725)

elif page == "Bi-directional data model":
    """
    On its own, Folium is limited to _display-only_ visualizations; the Folium API generates the proper [leaflet.js](https://leafletjs.com/) specification,
    as HTML and displays it. Some interactivity is provided (depending on how the Folium API is utilized), but the biggest drawback
    is that the interactivity from the visualization isn't passed back to Python, and as such, you can't make full use of the functionality
    provided by the leaflet.js library.

    `streamlit-folium` builds upon the convenient [Folium API](https://python-visualization.github.io/folium/modules.html)
    for building geospatial visualizations by adding a _bi-directional_ data transfer functionality. This not only allows for increased interactivity between
    the web browser and Python, but also the use of larger datasets through intelligent querying.

    ### Bi-directional data model

    If we take a look at the example from the Home page, it might seem trivial. We define a single point with a marker and pop-up and display it:
    """
    with st.echo():

        import streamlit as st
        from streamlit_folium import st_folium
        import folium

        # center on Liberty Bell, add marker
        m = folium.Map(location=[39.949610, -75.150282], zoom_start=16)
        folium.Marker(
            [39.949610, -75.150282],
            popup="Liberty Bell",
            tooltip="Liberty Bell"
        ).add_to(m)

        # call to render Folium map in Streamlit
        st_data = st_folium(m, width = 725)

    """
    But behind the scenes, a lot more is happening _by default_. The return value of `st_folium` is set to
    `st_data`, and within this Python variable is information about what is being displayed on the screen:
    """

    with st.expander("Expand to see data returned to Python"):
        st_data

    """
    As the user interacts with the data visualization, the values for `bounds` are constantly updating, along
    with `zoom`. With these values available in Python, we can now limit queries based on bounding box, change
    the marker size based on the `zoom` value and much more!
    """

elif page == "Plugin: Draw":

    """
    Folium supports some of the [most popular leaflet plugins](https://python-visualization.github.io/folium/plugins.html). In this example,
    we can add the [`Draw`](https://python-visualization.github.io/folium/plugins.html#folium.plugins.Draw) plugin to our map, which allows for drawing geometric shapes on the map.

    When a shape is drawn on the map, the coordinates that represent that shape are passed back as a geojson feature via
    the `all_drawings` and `last_active_drawing` data fields.

    Draw something below to see the return value back to Streamlit!
    """

    with st.echo():

        import folium
        import streamlit as st
        from folium.plugins import Draw
        from streamlit_folium import st_folium

        m = folium.Map(location=[39.949610, -75.150282], zoom_start=5)
        Draw(export=True).add_to(m)

        c1, c2 = st.columns(2)
        with c1:
            output = st_folium(m, width = 700, height=500)

        with c2:
            st.write(output)
