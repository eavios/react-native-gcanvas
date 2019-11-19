#include <stdio.h>
#include <stdlib.h>
#include <string>
#include <algorithm>

#include <iostream>
#include <GCanvas.hpp>
#include <lodepng.h>
#include <fstream>
#define CONTEXT_ES20

#include "GBenchMark.h"
const static GLuint renderBufferHeight = 300;
const static GLuint renderBufferWidth = 300;

   

int main(int argc, char *argv[])
{
 
   GBenchMark becnMarker(renderBufferWidth,renderBufferHeight);
   becnMarker.intilGLOffScreenEnviroment();
   becnMarker.run("fillRect",[](std::shared_ptr<gcanvas::GCanvas> canvas, GCanvasContext *ctx,int width,int height){
          ctx->SetFillStyle("#ff0000");
          ctx->FillRect(0, 0, width, height);
            // canvas->mCanvasContext->SetFont("20px Georgia");
            //  canvas->mCanvasContext->DrawText("你好123 ",10,20);
   });
    
    
//    std:: ofstream myfile;
//    myfile.open ("result.txt");
//    myfile << case1->getCaseName();
//    myfile << "#";
//    myfile << case1->ratio;
//    myfile.close();
}