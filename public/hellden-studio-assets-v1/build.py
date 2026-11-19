import trimesh, numpy as np, json, os, zipfile, math
from pathlib import Path
P=Path('/mnt/data/hellden-assets'); scene=trimesh.Scene(); inventory=[]
def color(h):return tuple(bytes.fromhex(h.strip('#')))+(255,)
def box(name,xyz,size,c):
 m=trimesh.creation.box(extents=size);m.apply_translation(xyz);m.visual.face_colors=color(c);scene.add_geometry(m,node_name=name,geom_name=name);inventory.append(name)
def cyl(name,xyz,r,h,c):
 m=trimesh.creation.cylinder(radius=r,height=h,sections=16);m.apply_translation(xyz);m.visual.face_colors=color(c);scene.add_geometry(m,node_name=name,geom_name=name);inventory.append(name)
# coordinate: x 0-10, y 0(front)-16(back), z upward
floor='#D6C6B3';wall='#78675F'; wood='#76503B';dark='#302729';red='#9D292C';steel='#77838B';blue='#4E7085'
box('floor1_base',(5,8,-.16),(10,16,.32),'#B5A394');box('floor2_base',(5,8,4.08),(10,16,.20),'#C8B7A6')
# perimeter back and side low walls, leave front open
for z in [0,4.25]:
 box(f'back_wall_z{z}',(5,15.94,z+1.5),(10,.12,3),wall)
 box(f'left_wall_z{z}',(.07,8,z+1.5),(.14,16,3),wall)
 box(f'right_wall_z{z}',(9.93,8,z+1.5),(.14,16,3),wall)
# front door portal
box('entry_left_pillar',(4.05,.13,1.6),(.18,.25,3.2),wood)
box('entry_right_pillar',(6.75,.13,1.6),(.18,.25,3.2),wood)
box('entry_lintel',(5.4,.13,3.15),(2.9,.25,.22),wood)
# room layout from plan: left column x .2-4.2; right x 7-9.8
rooms=[('kasir_l1',.2,4.2,.8,2.9,0,'#625C58'),('portrait_l1',.2,4.2,2.9,5.55,0,'#873F3D'),('cinema_l1',.2,4.2,5.55,8.2,0,'#5A3337'),('record_l1',.2,4.2,8.2,10.9,0,'#704D3C'),('express_l1',.2,4.2,10.9,13.6,0,'#657A87'),('stairs_l1',.2,3.05,15.25,15.85,0,'#99938D'),('waiting_l1',7,9.8,.9,4.1,0,'#897C70'),('diy_l1',7,9.8,4.9,12.35,0,'#B59AA6'),('beverage_l1',5.85,9.8,13.3,15.85,0,'#9A7858'),('self_photo_portrait_l2',2.05,7.75,.85,3.05,4.25,'#B5A2B9'),('operator_cashier_l2',.2,3.0,6.3,10.5,4.25,'#9A8D80'),('diy_self_photo_l2',7.1,9.8,6.5,10.7,4.25,'#A4A2B7')]
config=[]
for name,x1,x2,y1,y2,z,c in rooms:
 cx=(x1+x2)/2;cy=(y1+y2)/2
 box(name+'_floor',(cx,cy,z+.035),(x2-x1,y2-y1,.07),c)
 # back partition and left/right side dividers, open toward corridor
 if name!='stairs_l1':
  box(name+'_rear',(cx,y2-.06,z+1.15),(x2-x1,.12,2.3),wood)
  if x1>5:box(name+'_outer',(x2-.05,cy,z+1.15),(.10,y2-y1,2.3),wood)
  else:box(name+'_outer',(x1+.05,cy,z+1.15),(.10,y2-y1,2.3),wood)
 config.append(dict(id=name, floor=2 if z else 1, bounds=dict(x=[x1,x2],y=[y1,y2]), center=[round(cx,2),round(cy,2),z+1.2], cameraTarget=[round(cx,2),round(cy,2),z+1.2], material=c))
# reception counters
box('cashier_desk_l1',(2,1.55,.58),(2,.55,1.15),wood)
box('waiting_sofa',(8.5,2.5,.43),(1.95,.75,.85),'#5B433B')
box('beverage_counter',(7.9,14.45,.55),(2.5,.65,1.1),wood)
for i in range(5):cyl(f'beverage_cup_{i}',(6.9+i*.45,14.45,1.23),.11,.22,'#D7C4A3')
# record wall shelves, vinyl discs, sofa
box('record_vinyl_shelf',(1.4,10.64,1.35),(2.15,.18,2.3),'#563C30')
for i in range(3):
 for j in range(5):
  cyl(f'vinyl_{i}_{j}',(.55+j*.4,10.47,.7+i*.66),.15,.03,'#1C1C1F')
box('record_sofa',(2.4,9.25,.5),(2.3,.8,1),'#49302C')
# cinema red sofa and clapper
box('cinema_red_sofa',(2.3,6.7,.53),(2.8,.85,1.06),red)
for i in range(3):box(f'cinema_seat_{i}',(1.45+i*.85,6.7,.68),(.73,.7,.65),'#B12C33')
box('cinema_screen',(2.2,8.05,1.7),(2.8,.06,1.55),'#1B1A1D')
# portrait backdrop and camera
box('portrait_backdrop',(2.2,5.35,1.55),(2.75,.08,2.5),'#D4C3B5')
for i,x in enumerate([1.15,3.35]):
 cyl(f'portrait_lightstand_{i}',(x,3.5,.9),.04,1.8,'#222326')
 box(f'portrait_softbox_{i}',(x,3.5,1.85),(.48,.22,.55),'#EAE3D8')
# express metro bench and windows
box('express_bench',(2.25,12.25,.45),(2.7,.68,.9),blue)
for i in range(3):
 box(f'express_window_{i}',(.9+i*1.2,13.5,1.7),(.85,.08,1.25),'#B6CBD1')
 cyl(f'express_hanging_handle_{i}',(.9+i*1.2,12.4,2.42),.13,.06,'#3462A1')
# DIY area studio backdrop props
box('diy_backdrop',(8.5,11.9,1.4),(2.1,.09,2.5),'#E7C7D9')
for i in range(4):cyl(f'diy_stool_{i}',(7.6+(i%2)*1.2,6+(i//2)*1.4,.4),.27,.8,'#C6A9A3')
# stairs at rear left, rising visually
for i in range(12):box(f'stair_step_{i}',(1.15+i*.13,15.0-i*.10,.17+i*.28),(2.0,.28,.22),'#A18D7E')
# second floor furniture
box('operator_desk_l2',(1.55,8.5,4.8),(2,.65,1.1),wood)
box('selfphoto_backdrop_l2',(4.9,2.88,5.65),(3.4,.1,2.4),'#E8D8E5')
box('selfphoto_camera_l2',(4.9,1.6,5.65),(.22,.22,.3),'#2A2A30')
box('selfphoto_diy_backdrop_l2',(8.5,10.4,5.65),(2.0,.09,2.5),'#D9D1EA')
for i,x in enumerate([3.0,6.7]):
 cyl(f'floor2_lightstand_{i}',(x,2.0,5.2),.04,1.7,'#28292C')
 box(f'floor2_softbox_{i}',(x,2.0,6.12),(.48,.3,.55),'#F1E6DA')
# top roof outline beams open for cutaway
for y in [0,8,16]:box(f'roof_beam_{y}',(5,y,7.58),(10,.12,.18),'#4C3D36')
for x in [0,10]:box(f'roof_beam_side_{x}',(x,8,7.58),(.12,16,.18),'#4C3D36')
# export
scene.export(P/'hellden-building-blockout.glb')
(P/'room-config.json').write_text(json.dumps({'units':'conceptual; not surveyed meters','axes':'x left-to-right, y entrance-to-rear, z vertical','entrance':'front y=0','floors':2,'rooms':config},indent=2))
(P/'asset-inventory.json').write_text(json.dumps({'nodes':inventory,'nodeCount':len(inventory)},indent=2))
(P/'README.md').write_text('''# Hellden Studio — Anatomy 3D Blockout v1\n\nThis is an **editable concept-stage GLB scene**, not a survey-accurate reconstruction.\n\n## Layout\n- Floor 1: left from entrance to back = cashier, portrait, cinema, record, express; rear left = stairs. Right = waiting room, DIY, beverage.\n- Floor 2: front = self photo portrait; left = operator/cashier; right = DIY self photo.\n\n## Contents\n- `hellden-building-blockout.glb`: named geometry nodes, colored room floors, walls and stylized furniture. Import into Blender or load in Three.js / React Three Fiber.\n- `room-config.json`: room bounds and camera targets for click hotspots and scroll choreography.\n- `asset-inventory.json`: node names for later editing.\n- `build.py`: procedural generator.\n\n## Important\nDimensions are approximate, and wall openings, stair placement, room dimensions, furniture and finishes must be verified against actual measurements and images. The model intentionally leaves the front open for cutaway viewing. Room labels are in JSON, not rendered in the GLB.\n\n## Suggested next steps\n1. Import GLB in Blender and inspect the scene.\n2. Adjust geometry to measured dimensions and photo references.\n3. Replace simple furniture blocks with detailed optimized meshes.\n4. Set up GSAP camera timeline and room interactions in Next.js.\n''')
with zipfile.ZipFile('/mnt/data/hellden-studio-assets-v1.zip','w',zipfile.ZIP_DEFLATED) as z:
 for f in P.iterdir():z.write(f,arcname=f.name)
print('nodes',len(inventory),'glb bytes',(P/'hellden-building-blockout.glb').stat().st_size)
