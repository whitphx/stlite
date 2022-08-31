/* eslint-disable import/no-webpack-loader-syntax */

import hello_py from "!!raw-loader!./Hello.py"
import plotting_demo_py from "!!raw-loader!./pages/1_Plotting_Demo.py"
import matplotlib_demo_py from "!!raw-loader!./pages/Matplotlib_Demo.py"
import map_demo_py from "!!raw-loader!./pages/Map_Demo.py"
import custom_component_demo_py from "!!raw-loader!./pages/Custom_Component_Demo_(HiPlot).py"

const files: { [path: string]: string } = {
  "Hello.py": hello_py,
  "pages/1_Plotting_Demo.py": plotting_demo_py,
  "pages/Matplotlib_Demo.py": matplotlib_demo_py,
  "pages/Map_Demo.py": map_demo_py,
  "pages/Custom_Component_Demo_(HiPlot).py": custom_component_demo_py,
}

export default files;
