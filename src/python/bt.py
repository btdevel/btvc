import sys, os
from math import pi, sin, cos

from direct.showbase.ShowBase import ShowBase
from direct.gui.DirectGui import OnscreenText
#from panda3d.core import CardMaker
from panda3d.core import GeomVertexFormat, GeomVertexData, GeomVertexWriter
from panda3d.core import GeomNode, Geom, GeomTriangles
from panda3d.core import Texture, TextureStage, NodePath
from panda3d.core import PerspectiveLens
from panda3d.core import Light, Spotlight, PointLight, AmbientLight, LightRampAttrib
from panda3d.core import TextNode, loadPrcFile
from panda3d.core import Vec3, Vec4, Point3, Material
from direct.interval.IntervalGlobal import Sequence, Parallel
from direct.interval.LerpInterval import LerpFunctionInterval
from direct.interval.FunctionInterval import Func
from direct.showbase.Loader import Loader

from pd import makeSquare, makeCube

from btimport import *

loadPrcFile("config.prc")

def white(s):
    return Vec4(s, s, s, 1)


class config(object):
    start_level = "level07"
    # start_level = "level00"

    camera_angle = 90
    camera_angle = 110
    camera_angle_out = 60

    global_ambient = white(0.005)
    #global_ambient = white(1.5)
    plight_color = Vec4(2, 2, 0.7, 1)
    plight_color = white(10)
    plight_attenuation = (0.2, 0.0, 0.7)
    #plight_attenuation = (0.0, 0.0, 0.0)

    flash_white = True
    flash_time = 0.2
    move_time = 5*0.2

    smoke_color = white(0.1)
    smoke_exp_density = 1.0

objects = {}

def throne():
    if "throne" not in objects:
        tex=Loader("foo").loadTexture("models/throne/duke_throne_d.png")
        throne = Loader("foo").loadModel('models/throne/throne.obj')
        myMaterial = Material()
        myMaterial.setShininess(130.0)
        myMaterial.setAmbient(white(0.2))
        myMaterial.setEmission(white(0.0))
        myMaterial.setDiffuse(white(0.8))
        myMaterial.setSpecular(white(1.3))

        throne.setTexture(tex)
        throne.setMaterial(myMaterial)
        throne.setPos(0, 0.5, -1.02)
        throne.setHpr(0, 90, 0)
        s = 0.4
        throne.setScale(s, s, s)


        if False:
        #throne = Loader("foo").loadModel('models/test/knight_statue2.x')
        #throne = Loader("foo").loadModel('models/test/Wall mounted torch.x')
        #throne = Loader("foo").loadModel('models/test/knight_statue.egg')
        #throne = Loader("foo").loadModel('models/test/torch.egg')
        #throne = Loader("foo").loadModel('models/test/Wall mounted torch.egg')
        #throne = Loader("foo").loadModel('models/test/door_heavy_metal.egg')
            s = 0.7
        #s =
            throne.setScale(s, s, s)
        #throne.setPos(0, 0.5, -1.02)
            throne.setPos(2, 3.0, -1.02)
            throne.setHpr(180, 0, 0)
        objects["throne"] = throne



    throne = objects["throne"]
    node = NodePath("throne")
    throne.instanceTo(node)
    return node


def pos2vec(pos):
    return Point3(pos[0]*2, pos[1]*2, 0)

def render_level(map):
    # tex=Loader("foo").loadTexture("models/BrickOldSharp0215_2_thumbhuge.jpg")
    # nor=Loader("foo").loadTexture("models/BrickOldSharp0215_2_thumbhuge-n.jpg")
    # tex=loader.loadTexture("models/wall1/diffus.png")
    # nor=loader.loadTexture("models/wall1/normal.png")
    # bump=loader.loadTexture("models/wall1/height.png")
    dir = "models/Brick_wall_002/"
    tex=loader.loadTexture(dir + "Brick_wall_002_COLOR.jpg")
    nor=loader.loadTexture(dir + "Brick_wall_002_NORM.jpg")
    bump=loader.loadTexture(dir + "Brick_wall_002_DISP.png")
# -rw-r--r-- 1 ezander ezander  80389 Nov 23  2017 Brick_wall_002_AO.jpg
# -rw-r--r-- 1 ezander ezander 391964 Nov 23  2017 Brick_wall_002_COLOR.jpg
# -rw-r--r-- 1 ezander ezander 291221 Jan 13  2018 Brick_wall_002_DISP.png
# -rw-r--r-- 1 ezander ezander 192236 Nov 23  2017 Brick_wall_002_NORM.jpg
# -rw-r--r-- 1 ezander ezander 106706 Nov 23  2017 Brick_wall_002_SPEC.jpg

    tsn = TextureStage('ts')
    tsn.setMode(TextureStage.MNormal)
    tsh = TextureStage('ts')
    tsh.setMode(TextureStage.MHeight)

    myMaterial = Material()
    # myMaterial.setShininess(0.0)
    # myMaterial.setAmbient(white(10.8))
    # myMaterial.setEmission(white(0.0))
    myMaterial.setDiffuse(white(0.2))
    myMaterial.setSpecular(white(1.0))

    level_node = NodePath("level")
    for i in range(0,22,1):
        x = i * 2.0
        for j in range(0,22,1):
            y = j * 2.0

            hideset = set()
            cell = map[i][j]
            if cell.north == OPEN: hideset.add(2)
            if cell.west == OPEN: hideset.add(3)
            if cell.south == OPEN: hideset.add(0)
            if cell.east == OPEN: hideset.add(1)

            xcube = makeCube(inverse=True, hide=hideset)
            cube = NodePath(xcube)
            cube.setTexture(tex)
            cube.setTexture(tsn,nor)
            #cube.setTexture(tsh,bump)
            cube.reparentTo(level_node)
            cube.setPos(x, y, 0 )
            cube.setMaterial(myMaterial)
            cube.setShaderAuto()
    return level_node


class App(ShowBase):
    def __init__(self):

        ShowBase.__init__(self)
        self.disableMouse()
        self.camLens.setNear(0.01)
        self.camLens.setFar(100)
        self.camLens.setFov(config.camera_angle)
        self.setBackgroundColor(Vec4(0, 0, 0, 1))
        

        self.level = load_level(config.start_level)
        self.dir = Direction()
        self.pos = Vector([0, 0])


        level_node = render_level(self.level)
        level_node.reparentTo(self.render)

        self.accept("escape", exit)
        self.accept("arrow_up", self.forward)
        self.accept("arrow_down", self.reverse)
        self.accept("arrow_down", self.backwards)
        self.accept("arrow_left", self.turn_left)
        self.accept("arrow_right", self.turn_right)

        self.accept("1", self.set_camera_in)
        self.accept("2", self.set_camera_out)
        self.accept("3", self.spin_camera_left)
        self.accept("4", self.spin_camera_right)

        self.accept("l", self.set_light)
        self.accept("d", self.set_dark)

        self.accept("s", self.toggle_smoke)

        title = OnscreenText(text="Bard's Tale I",
                             style=1, fg=(1,1,1,1),
                             pos=(0.7,0.92), scale = .07)


        slight = PointLight('slight')
        slight.setColor(config.plight_color)
        slight.setSpecularColor(Vec4(0.1,0.1,0,0))

        slight.setAttenuation(config.plight_attenuation)
        slnp = render.attachNewNode(slight)
        inode = render.attachNewNode("foo")
        Sequence(
            inode.posInterval(0.3, Vec3(0.0, 0.0, 0.15)),
            inode.posInterval(0.3, Vec3(0.0, 0.0, 0.0)),
            inode.posInterval(0.3, Vec3(0.15, 0.0, 0.0)),
            inode.posInterval(0.3, Vec3(0.0, 0.0, 0.0)),
            inode.posInterval(0.3, Vec3(0.0, 0.15, 0.0)),
            inode.posInterval(0.3, Vec3(0.0, 0.0, 0.0)),
        ).loop()
        slnp.reparentTo(inode)

        render.setLight(slnp)
        self.slight = slight
        self.light = slnp

        alight = AmbientLight('alight')
        alight.setColor(config.global_ambient)
        alnp = render.attachNewNode(alight)
        self.alight = alight
        render.setLight(alnp)

        text = TextNode("foo")
        text.setText("")
        text.setShadow(1,0.0)
        text.setShadowColor(0, 0, 0, 1)
        tn = NodePath(text)
        tn.setScale(0.1)
        tn.reparentTo(aspect2d)
        tn.setPos(-1, -1, 0)
        self.text = text

        obj = throne()
        tx, ty = 9, 14
        tx, ty = 0, 1
        obj.setPos(tx*2, ty*2, 0)
        obj.reparentTo(render)
        # object_factory.create("throne", tx, ty, Direction.SOUTH, render)

        print self.eventMgr

        from panda3d.core import AntialiasAttrib
        self.render.setAntialias(AntialiasAttrib.MMultisample)

        self.follow = True
        self.set_camera()


        #render.setAttrib(LightRampAttrib.makeIdentity())
        render.setShaderAuto()

        print self.graphicsEngine
        print self.pipe


    def set_light(self):
        config.plight_attenuation = (0.8, 0, 0.02)
        self.slight.set_attenuation(config.plight_attenuation)


    def set_dark(self):
        config.plight_attenuation = (0.2, 0, 0.7)
        self.slight.set_attenuation(config.plight_attenuation)



    def spin_camera_right(self, degrees=360, time=1.0):
        s = self.dir.dir * 90.0
        self.camera.hprInterval(time, Point3(s, 0, 0),
                                startHpr=Point3(s+degrees, 0, 0)).start()
    def spin_camera_left(self, degrees=360, time=1.0):
        s = self.dir.dir * 90.0
        self.camera.hprInterval(time, Point3(s, 0, 0),
                                startHpr=Point3(s-degrees, 0, 0)).start()

    def set_camera(self):
        pos = pos2vec(self.pos)
        dir = pos2vec(self.dir.forward_vec)
        
        if self.follow:
            self.camera.setPos(pos)
            #self.camera.setPos(Point3(pos-dir*0.5))
            self.camera.setPos(Point3(pos))
            self.camera.lookAt(Point3(pos+dir))
            self.camLens.setFov(config.camera_angle)
        self.light.setPos(Point3(pos))


    def set_camera_out(self):
        self.camera.setPos(21, -40, 30)
        self.camera.lookAt(21, 20, 0)
        self.camLens.setFov(config.camera_angle_out)
        self.follow = False

    def set_camera_in(self):
        self.follow = True
        self.set_camera()

    def moved(self):
        x, y = self.pos[0], self.pos[1]
        cell = self.level[x][y]
        msg = cell.msg
        if msg:
            print ">", x, y, msg
            self.text.setText(msg)
            self.text.setWordwrap(10)
        else:
            self.text.setText("")

        if cell.spinner:
            self.spin_camera_left(degrees=3*360, time=1.0)
        if cell.teleport:
            self.teleport(Vector(cell.teleport))
            

    def forward(self):
        x, y = self.pos[0], self.pos[1]
        cell = self.level[x][y]
        if self.level[x][y].walls[self.dir.dir]!=WALL:
            self.pos = self.pos + self.dir.forward_vec
            Sequence(
                Parallel(
                    self.camera.posInterval(config.move_time, pos2vec(self.pos)),
                    self.light.posInterval(config.move_time, pos2vec(self.pos))
                    ),
                Func(self.moved)
                ).start()

    def reverse(self):
        self.dir.reverse()
        self.set_camera()
        
    def backwards(self):
        self.dir.reverse()
        if self.level[self.pos[0]][self.pos[1]].walls[self.dir.dir]!=WALL:
            self.pos = self.pos + self.dir.forward_vec

            Sequence(
                Parallel(
                    self.camera.posInterval(config.move_time, pos2vec(self.pos)),
                    self.light.posInterval(config.move_time, pos2vec(self.pos))
                    ),
                Func(self.moved)
                ).start()

        self.dir.reverse()

    def turn_left(self):
        self.dir.left()
        self.set_camera()
        self.spin_camera_left(degrees=90, time=0.2)

    def turn_right(self):
        self.dir.right()
        self.set_camera()
        self.spin_camera_right(degrees=90, time=0.2)

    def toggle_smoke(self):
        from panda3d.core import Fog
        if self.render.getFog():
            self.render.clearFog()
        else:
            smoke = Fog("smoke")
            smoke.setColor(config.smoke_color)
            smoke.setExpDensity(config.smoke_exp_density)
            render.setFog(smoke)

 
    # Define a procedure to move the camera.
    def teleport(self, newpos):
        self.newpos = newpos

        if config.flash_white:
            light = self.alight
            color1 = Vec4(light.getColor())
            color2 = white(20.0)
            color2 = Vec4(4, 7, 20, 1)
            color2 = Vec4(6, 10, 20, 1)
        else:
            light = self.slight
            color1 = Vec4(light.getColor())
            color2 = white(0.0)

        dt = config.flash_time / 2.0
        Sequence(
            LerpFunctionInterval(light.setColor, dt, color1, color2),
            Func(self.set_newpos, newpos),
            LerpFunctionInterval(light.setColor, dt, color2, color1),

            ).start()

    def set_newpos(self, newpos):
        self.pos = newpos
        self.set_camera()

        

app=App()
app.run()





