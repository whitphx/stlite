"""
This sample code has been copied from
https://github.com/napoles-uach/stmol
"""

from stmol import showmol
import py3Dmol
# 1A2C
# Structure of thrombin inhibited by AERUGINOSIN298-A from a BLUE-GREEN ALGA
xyzview = py3Dmol.view(query='pdb:1A2C')
xyzview.setStyle({'cartoon':{'color':'spectrum'}})
showmol(xyzview, height = 500,width=800)
