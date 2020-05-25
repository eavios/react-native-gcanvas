#define CONTEXT_ES20
#ifndef GBACKEND_H
#define GBACKEND_H
#include <iostream>
#include <GCanvas.hpp>
#include "lodepng.h"
#include <functional>
#include <unordered_map>
#include "GConvert.h"
#include "NodeBindingUtil.h"
#include "Util.h"
#include "GFrameBufferObject.h"

namespace NodeBinding
{
extern void encodePixelsToPNGFile(std::string filename, uint8_t *buffer, int width, int height);
extern void decodeFile2Pixels(std::string filename, std::vector<unsigned char> &image);
extern void encodePixelsToJPEGFile(std::string filename, uint8_t *buffer, int width, int height);
class GRenderContext
{
public:
    GRenderContext() : mWidth(0), mHeight(0), mCanvas(nullptr)
    {
        
    }
    GRenderContext(int width, int height);
    GRenderContext(int width, int height, int ratio);
    virtual ~GRenderContext();
    void initRenderEnviroment();
    void render2file(std::string caseName,PIC_FORMAT format);
    void drawFrame();
    GCanvasContext *getCtx() { return mCanvas->GetGCanvasContext(); }
    int inline getWdith() { return this->mWidth; }
    int inline getHeight() { return this->mHeight; }
    void destoryRenderEnviroment();
    void recordTextures(int textureId);
    
    void BindFBO();
    void makeCurrent();
    int getImagePixel(std::vector<unsigned char> &in, PIC_FORMAT format);
private:
    std::shared_ptr<gcanvas::GCanvas> mCanvas;
    void initCanvas();
    int mHeight;
    int mWidth;
    int mCanvasHeight;
    int mCanvasWidth;
    int mRatio;
    int drawCount = 0;
    EGLDisplay mEglDisplay;
    EGLSurface mEglSurface;
    EGLContext mEglContext;
    GLuint mFboId = 0;
    GLuint mRenderBuffer = 0;
    GLuint mDepthRenderbuffer = 0;
    std::vector<int> textures;
    int readPixelAndSampleFromCurrentCtx(unsigned char *data);
   
};
} // namespace NodeBinding

#endif