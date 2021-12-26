import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import {
  NativeEventEmitter,
  NativeModules,
  PanResponder,
  Platform,
  Text,
  View,
  findNodeHandle,
} from 'react-native';
import '@flyskywhy/react-native-browser-polyfill';
import CanvasView from './CanvasView';
import {enable, disable, ReactNativeBridge} from '../packages/gcanvas';
ReactNativeBridge.GCanvasModule = NativeModules.GCanvasModule;
ReactNativeBridge.Platform = Platform;

export default class GCanvasView extends Component {
  constructor(props) {
    super(props);
    this.refCanvasView = null;
    this.canvas = null;

    let panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderGrant: (event) => {
        let eventShim = {...event.nativeEvent, type: 'mousedown'};
        this.canvas.dispatchEvent(eventShim);
        window.dispatchEvent(eventShim);

        let mouseEvent = this.eventTouch2Mouse(event.nativeEvent);
        mouseEvent.type = 'mousedown';
        props.onMouseDown && props.onMouseDown(mouseEvent);
      },
      onPanResponderMove: (event, gestureState) => {
        let eventShim = {...event.nativeEvent, type: 'mousemove'};
        this.canvas.dispatchEvent(eventShim);

        // as `node_modules/zdog/js/dragger.js` use window.addEventListener not element.addEventListener on mousemove
        window.dispatchEvent(eventShim);

        let mouseEvent = this.eventTouch2Mouse(event.nativeEvent);
        mouseEvent.type = 'mousedown';
        props.onMouseMove && props.onMouseMove(mouseEvent);
      },
      onPanResponderRelease: (event, gestureState) => {
        let eventShim = {...event.nativeEvent, type: 'mouseup'};
        this.canvas.dispatchEvent(eventShim);
        window.dispatchEvent(eventShim);

        let mouseEvent = this.eventTouch2Mouse(event.nativeEvent);
        mouseEvent.type = 'mousedown';
        props.onMouseUp && props.onMouseUp(mouseEvent);
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: () => false,
    });

    this.state = {
      panResponder: {},
    };

    if (props.isGestureResponsible) {
      this.state.panResponder = panResponder;
    }
  }

  static propTypes = {
    // isOffscreen: PropTypes.bool,
    ...View.propTypes,
  };

  static defaultProps = {
    // Indicate whether response for gesture inside canvas,
    // so that PanResponder outside GCanvasView can be useable
    // when isGestureResponsible is false.
    // Default is true, so that zdog can be "mousemove".
    isGestureResponsible: true,
  };

  eventTouch2Mouse = (nativeEvent) => {
    if (nativeEvent.type) {
      // real mouse event have `type` but touch not
      // TODO: test with real mouse
      return {...nativeEvent};
    } else {
      return {
        altKey: false,
        button: 0,
        buttons: 1,
        clientX: nativeEvent.locationX,
        clientY: nativeEvent.locationY,
        ctrlKey: false,
        isTrusted: true,
        metaKey: false,
        pageX: nativeEvent.pageX,
        pageY: nativeEvent.pageY,
        shiftKey: false,
        target: this.canvas,
        timeStamp: nativeEvent.timestamp,
      }
    }
  }

  _onIsReady = (event) => {
    if (this.props.onIsReady) {
      this.props.onIsReady(
        Platform.OS === 'ios' ? true : event.nativeEvent.value,
      );
    }
  };

  _onLayout = (event) => {
    // When onLayout is invoked again (e.g. change phone orientation), if assign
    // `this.canvas` again, that also means `this` in dispatchEvent() of
    // `event-target-shim/dist/event-target-shim.js` changed, thus dispatchEvent()
    // can do nothing and cause `node_modules/zdog/js/dragger.js` can't be moved
    // by finger anymore.
    // So let `this.canvas` be assigned here only once.
    if (this.canvas !== null) {
      return;
    }

    if (this.refCanvasView === null) {
      this._onLayout(event);
      return;
    }

    this.canvas = enable(
      {
        ref: '' + findNodeHandle(this.refCanvasView),
        style: {
          width: event.nativeEvent.layout.width,
          height: event.nativeEvent.layout.height,
        },
      },
      {bridge: ReactNativeBridge},
    );

    if (this.props.onCanvasCreate) {
      this.props.onCanvasCreate(this.canvas);
    }
  };

  componentDidMount() {
    // ReactNativeBridge.GCanvasModule.setLogLevel(0); // 0 means DEBUG

    if (Platform.OS === 'ios') {
      // while always true in _onIsReady(), here is just to suppress warning
      // on iOS Sending `GCanvasReady` with no listeners registered.
      const emitter = new NativeEventEmitter(ReactNativeBridge.GCanvasModule);
      emitter.addListener('GCanvasReady', this._onIsReady);
    }
  }

  componentWillUnmount() {
    ReactNativeBridge.GCanvasModule.disable(
      '' + findNodeHandle(this.refCanvasView),
    );

    if (Platform.OS === 'ios') {
      const emitter = new NativeEventEmitter(ReactNativeBridge.GCanvasModule);
      emitter.removeListener('GCanvasReady', this._onIsReady);
    }
  }

  render() {
    if (Platform.OS === 'web') {
      return (
        <View {...this.props}>
          <Text>{'Please use <canvas> not <CanvasView> on Web'}</Text>
        </View>
      );
    } else {
      return (
        <CanvasView
          {...this.props}
          {...this.state.panResponder.panHandlers}
          ref={(view) => (this.refCanvasView = view)}
          onLayout={this._onLayout}
          onChange={this._onIsReady}
        />
      );
    }
  }
}
