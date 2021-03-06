'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

var _reactS3UploaderS3upload = require('react-s3-uploader/s3upload');

var _reactS3UploaderS3upload2 = _interopRequireDefault(_reactS3UploaderS3upload);

var _reactDropzone = require('react-dropzone');

var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

var DropzoneS3Uploader = (function (_React$Component) {
  _inherits(DropzoneS3Uploader, _React$Component);

  function DropzoneS3Uploader() {
    var _this = this;

    _classCallCheck(this, DropzoneS3Uploader);

    _React$Component.apply(this, arguments);

    this.onProgress = function (progress, status, file) {
      var progFn = _this.props.onProgress;
      if (progFn) progFn(progress, status, file);
      _this.setState({ progress: progress, status: status, filename: file.name });
    };

    this.onError = function (err) {
      var errFn = _this.props.onError;
      if (errFn) errFn(err);
      _this.setState({ error: err });
    };

    this.onFinish = function (signingState, info) {
      var finFn = _this.props.onFinish;
      if (finFn) finFn(info);
      _this.setState({ filename: info.filename, error: null, progress: null });
    };

    this.handleDrop = function (files) {
      var dropFn = _this.props.onDrop;
      if (dropFn) dropFn(files);

      var error = null;
      var size = files[0].size;
      var max_file_size = _this.props.max_file_size || _this.props.maxFileSize;

      if (!_this.props.multiple && files.length > 1) {
        error = 'Only drop one file';
      } else if (max_file_size && size > max_file_size) {
        var size_kb = (size / 1024 / 1024).toFixed(2);
        var max_kb = (max_file_size / 1024 / 1024).toFixed(2);
        error = 'Files nust be smaller than ' + max_kb + 'kb. Yours is ' + size_kb + 'kb';
      }
      _this.setState({ error: error });
      if (error) return;

      new _reactS3UploaderS3upload2['default']({ // eslint-disable-line
        files: files,
        signingUrl: _this.props.signing_url || _this.props.signingUrl || '/s3/sign',
        signingUrlQueryParams: _this.props.signing_url_query_params || _this.props.signingUrlQueryParams || {},
        onProgress: _this.onProgress,
        bucket_id: _this.props.bucket_id,
        onDrop: _this.props.onDrop,
        onFinishS3Put: _this.onFinish,
        onError: _this.onError,
        signingUrlHeaders: _this.props.signingUrlHeaders,
        uploadRequestHeaders: _this.props.headers,
        contentDisposition: 'auto',
        server: _this.props.server || _this.props.host || ''
      });
    };
  }

  DropzoneS3Uploader.isImage = function isImage(filename) {
    return filename && filename.match(/\.(jpeg|jpg|gif|png)/);
  };

  DropzoneS3Uploader.prototype.render = function render() {
    var state = this.state || { filename: this.props.filename };
    var filename = state.filename;
    var progress = state.progress;
    var error = state.error;

    var s3_url = this.props.s3_url || this.props.s3Url;
    var file_url = filename ? s3_url + this.props.bucket_id + '/' + filename : null;

    var dropzone_props = {
      style: this.props.style || {
        height: 200,
        border: 'dashed 2px #999',
        borderRadius: 5,
        position: 'relative',
        cursor: 'pointer'
      },
      activeStyle: this.props.active_style || this.props.activeStyle || {
        borderStyle: 'solid',
        backgroundColor: '#eee'
      },
      rejectStyle: this.props.reject_style || this.props.rejectStyle || {
        borderStyle: 'solid',
        backgroundColor: '#ffdddd'
      },
      multiple: this.props.multiple || false,
      accept: this.props.accept
    };

    var image_style = this.props.image_style || this.props.imageStyle || {
      position: 'absolute',
      top: 0,
      width: 'auto',
      height: '100%'
    };

    var contents = null;
    if (this.props.children) {
      contents = _react2['default'].cloneElement(_react2['default'].Children.only(this.props.children), {
        file_url: file_url, s3_url: s3_url, filename: filename, progress: progress, error: error, image_style: image_style,
        fileUrl: file_url, s3Url: s3_url, imageStyle: image_style
      });
    } else if (file_url) {
      if (DropzoneS3Uploader.isImage(file_url)) {
        contents = _react2['default'].createElement('img', { src: file_url, style: image_style });
      } else {
        contents = _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement('span', { className: 'glyphicon glyphicon-play', style: { fontSize: '50px' } }),
          filename
        );
      }
    }

    return _react2['default'].createElement(
      _reactDropzone2['default'],
      _extends({ onDrop: this.handleDrop }, dropzone_props),
      !progress ? contents : null,
      progress ? _react2['default'].createElement(_reactBootstrap.ProgressBar, { now: progress, label: '%(percent)s%', srOnly: true }) : null,
      error ? _react2['default'].createElement(
        'small',
        null,
        error
      ) : null
    );
  };

  _createClass(DropzoneS3Uploader, null, [{
    key: 'propTypes',
    value: {
      host: _react.PropTypes.string,
      server: _react.PropTypes.string,
      s3_url: _react.PropTypes.string,
      s3Url: _react.PropTypes.string,
      signing_url: _react.PropTypes.string,
      signingUrl: _react.PropTypes.string,
      signing_url_query_params: _react.PropTypes.object,
      signingUrlQueryParams: _react.PropTypes.object,
      bucket_id: _react.PropTypes.string,

      children: _react.PropTypes.element,
      headers: _react.PropTypes.object,
      multiple: _react.PropTypes.bool,
      accept: _react.PropTypes.string,
      filename: _react.PropTypes.string,
      max_file_size: _react.PropTypes.number,
      maxFileSize: _react.PropTypes.number,

      style: _react.PropTypes.object,
      active_style: _react.PropTypes.object,
      activeStyle: _react.PropTypes.object,
      reject_style: _react.PropTypes.object,
      rejectStyle: _react.PropTypes.object,
      image_style: _react.PropTypes.object,
      imageStyle: _react.PropTypes.object,

      onError: _react.PropTypes.func,
      onProgress: _react.PropTypes.func,
      onFinish: _react.PropTypes.func,
      onDrop: _react.PropTypes.func
    },
    enumerable: true
  }]);

  return DropzoneS3Uploader;
})(_react2['default'].Component);

exports['default'] = DropzoneS3Uploader;
module.exports = exports['default'];