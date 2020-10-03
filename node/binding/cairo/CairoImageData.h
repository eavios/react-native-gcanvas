// Copyright (c) 2010 LearnBoost <tj@learnboost.com>


#include <napi.h>
#include <vector>

namespace cairocanvas
{

class ImageData: public Napi::ObjectWrap<ImageData> 
{
  public:
    static void Init(Napi::Env env);
    static Napi::Object NewInstance(const Napi::CallbackInfo &info);
    ImageData(const Napi::CallbackInfo &info);

    std::vector<u_int8_t> &getPixles();
    inline int width() { return _width; }
    inline int height() { return _height; }
    inline uint8_t *data() { return _data; }


  private:
    int _width;
    int _height;
    uint8_t *_data;

  private:
    static Napi::FunctionReference constructor;
    Napi::ObjectReference mImageDataRef;
    std::vector<u_int8_t> pixels;
    Napi::Value getData(const Napi::CallbackInfo &info);
    // void setData(const Napi::CallbackInfo &info, const Napi::Value &value);
    Napi::Value getWidth(const Napi::CallbackInfo &info);
    Napi::Value getHeight(const Napi::CallbackInfo &info);
    bool hasImageDataWrite = false;
};

}