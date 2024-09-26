"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/components/TaskContext.tsx":
/*!****************************************!*\
  !*** ./src/components/TaskContext.tsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   TaskProvider: () => (/* binding */ TaskProvider),\n/* harmony export */   useTask: () => (/* binding */ useTask)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst TaskContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nconst TaskProvider = ({ children })=>{\n    const [task, setTask] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({\n        createdBy: \"\",\n        taggedStaff: \"\",\n        contributingStaff: \"\",\n        taskName: \"\",\n        history: \"\",\n        examination: \"\",\n        diagnosis: \"\",\n        plan: \"\",\n        followUp: \"\",\n        postConsultation: \"\",\n        feedback: \"\",\n        keyLearningPoint: \"\",\n        action: \"\",\n        Library: false,\n        Learn: false\n    });\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(TaskContext.Provider, {\n        value: {\n            task,\n            setTask\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Admin\\\\website_team-1\\\\tasklearn_frontend\\\\src\\\\components\\\\TaskContext.tsx\",\n        lineNumber: 48,\n        columnNumber: 9\n    }, undefined);\n};\nconst useTask = ()=>{\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(TaskContext);\n    if (!context) {\n        throw new Error(\"useTask must be used within a TaskProvider\");\n    }\n    return context;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9UYXNrQ29udGV4dC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUE4RTtBQXlCOUUsTUFBTUksNEJBQWNILG9EQUFhQSxDQUE4Qkk7QUFFeEQsTUFBTUMsZUFBa0QsQ0FBQyxFQUFFQyxRQUFRLEVBQUU7SUFDeEUsTUFBTSxDQUFDQyxNQUFNQyxRQUFRLEdBQUdOLCtDQUFRQSxDQUFPO1FBQ25DTyxXQUFXO1FBQ1hDLGFBQWE7UUFDYkMsbUJBQW1CO1FBQ25CQyxVQUFVO1FBQ1ZDLFNBQVM7UUFDVEMsYUFBYTtRQUNiQyxXQUFXO1FBQ1hDLE1BQU07UUFDTkMsVUFBVTtRQUNWQyxrQkFBa0I7UUFDbEJDLFVBQVU7UUFDVkMsa0JBQWtCO1FBQ2xCQyxRQUFRO1FBQ1JDLFNBQVM7UUFDVEMsT0FBTztJQUNYO0lBRUEscUJBQ0ksOERBQUNwQixZQUFZcUIsUUFBUTtRQUFDQyxPQUFPO1lBQUVsQjtZQUFNQztRQUFRO2tCQUN4Q0Y7Ozs7OztBQUdiLEVBQUU7QUFFSyxNQUFNb0IsVUFBVTtJQUNuQixNQUFNQyxVQUFVMUIsaURBQVVBLENBQUNFO0lBQzNCLElBQUksQ0FBQ3dCLFNBQVM7UUFDVixNQUFNLElBQUlDLE1BQU07SUFDcEI7SUFDQSxPQUFPRDtBQUNYLEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90YXNrbGVhcm5fZnJvbnRlbmQvLi9zcmMvY29tcG9uZW50cy9UYXNrQ29udGV4dC50c3g/MDUxOSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0JztcclxuXHJcbmludGVyZmFjZSBUYXNrIHtcclxuICAgIGNyZWF0ZWRCeTogc3RyaW5nO1xyXG4gICAgdGFnZ2VkU3RhZmY6IHN0cmluZztcclxuICAgIGNvbnRyaWJ1dGluZ1N0YWZmOiBzdHJpbmc7XHJcbiAgICB0YXNrTmFtZTogc3RyaW5nO1xyXG4gICAgaGlzdG9yeTogc3RyaW5nO1xyXG4gICAgZXhhbWluYXRpb246IHN0cmluZztcclxuICAgIGRpYWdub3Npczogc3RyaW5nO1xyXG4gICAgcGxhbjogc3RyaW5nO1xyXG4gICAgZm9sbG93VXA6IHN0cmluZztcclxuICAgIHBvc3RDb25zdWx0YXRpb246IHN0cmluZztcclxuICAgIGZlZWRiYWNrOiBzdHJpbmc7XHJcbiAgICBrZXlMZWFybmluZ1BvaW50OiBzdHJpbmc7XHJcbiAgICBhY3Rpb246IHN0cmluZztcclxuICAgIExpYnJhcnk6IGJvb2xlYW47XHJcbiAgICBMZWFybjogYm9vbGVhbjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFRhc2tDb250ZXh0VHlwZSB7XHJcbiAgICB0YXNrOiBUYXNrO1xyXG4gICAgc2V0VGFzazogUmVhY3QuRGlzcGF0Y2g8UmVhY3QuU2V0U3RhdGVBY3Rpb248VGFzaz4+O1xyXG59XHJcblxyXG5jb25zdCBUYXNrQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8VGFza0NvbnRleHRUeXBlIHwgdW5kZWZpbmVkPih1bmRlZmluZWQpO1xyXG5cclxuZXhwb3J0IGNvbnN0IFRhc2tQcm92aWRlcjogUmVhY3QuRkM8eyBjaGlsZHJlbjogUmVhY3ROb2RlIH0+ID0gKHsgY2hpbGRyZW4gfSkgPT4ge1xyXG4gICAgY29uc3QgW3Rhc2ssIHNldFRhc2tdID0gdXNlU3RhdGU8VGFzaz4oe1xyXG4gICAgICAgIGNyZWF0ZWRCeTogJycsXHJcbiAgICAgICAgdGFnZ2VkU3RhZmY6ICcnLFxyXG4gICAgICAgIGNvbnRyaWJ1dGluZ1N0YWZmOiAnJyxcclxuICAgICAgICB0YXNrTmFtZTogJycsXHJcbiAgICAgICAgaGlzdG9yeTogJycsXHJcbiAgICAgICAgZXhhbWluYXRpb246ICcnLFxyXG4gICAgICAgIGRpYWdub3NpczogJycsXHJcbiAgICAgICAgcGxhbjogJycsXHJcbiAgICAgICAgZm9sbG93VXA6ICcnLFxyXG4gICAgICAgIHBvc3RDb25zdWx0YXRpb246ICcnLFxyXG4gICAgICAgIGZlZWRiYWNrOiAnJyxcclxuICAgICAgICBrZXlMZWFybmluZ1BvaW50OiAnJyxcclxuICAgICAgICBhY3Rpb246ICcnLFxyXG4gICAgICAgIExpYnJhcnk6IGZhbHNlLFxyXG4gICAgICAgIExlYXJuOiBmYWxzZSxcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRhc2tDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IHRhc2ssIHNldFRhc2sgfX0+XHJcbiAgICAgICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgICA8L1Rhc2tDb250ZXh0LlByb3ZpZGVyPlxyXG4gICAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB1c2VUYXNrID0gKCkgPT4ge1xyXG4gICAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoVGFza0NvbnRleHQpO1xyXG4gICAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1c2VUYXNrIG11c3QgYmUgdXNlZCB3aXRoaW4gYSBUYXNrUHJvdmlkZXInKTtcclxuICAgIH1cclxuICAgIHJldHVybiBjb250ZXh0O1xyXG59O1xyXG4iXSwibmFtZXMiOlsiUmVhY3QiLCJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsInVzZVN0YXRlIiwiVGFza0NvbnRleHQiLCJ1bmRlZmluZWQiLCJUYXNrUHJvdmlkZXIiLCJjaGlsZHJlbiIsInRhc2siLCJzZXRUYXNrIiwiY3JlYXRlZEJ5IiwidGFnZ2VkU3RhZmYiLCJjb250cmlidXRpbmdTdGFmZiIsInRhc2tOYW1lIiwiaGlzdG9yeSIsImV4YW1pbmF0aW9uIiwiZGlhZ25vc2lzIiwicGxhbiIsImZvbGxvd1VwIiwicG9zdENvbnN1bHRhdGlvbiIsImZlZWRiYWNrIiwia2V5TGVhcm5pbmdQb2ludCIsImFjdGlvbiIsIkxpYnJhcnkiLCJMZWFybiIsIlByb3ZpZGVyIiwidmFsdWUiLCJ1c2VUYXNrIiwiY29udGV4dCIsIkVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/components/TaskContext.tsx\n");

/***/ }),

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _components_TaskContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/TaskContext */ \"./src/components/TaskContext.tsx\");\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_TaskContext__WEBPACK_IMPORTED_MODULE_1__.TaskProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\Admin\\\\website_team-1\\\\tasklearn_frontend\\\\src\\\\pages\\\\_app.tsx\",\n            lineNumber: 6,\n            columnNumber: 13\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Admin\\\\website_team-1\\\\tasklearn_frontend\\\\src\\\\pages\\\\_app.tsx\",\n        lineNumber: 5,\n        columnNumber: 9\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDeUQ7QUFDekQsU0FBU0MsTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUM3QyxxQkFDSSw4REFBQ0gsaUVBQVlBO2tCQUNULDRFQUFDRTtZQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7O0FBR3BDO0FBRUEsaUVBQWVGLEtBQUtBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90YXNrbGVhcm5fZnJvbnRlbmQvLi9zcmMvcGFnZXMvX2FwcC50c3g/ZjlkNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJztcclxuaW1wb3J0IHsgVGFza1Byb3ZpZGVyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9UYXNrQ29udGV4dCc7XHJcbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRhc2tQcm92aWRlcj5cclxuICAgICAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxyXG4gICAgICAgIDwvVGFza1Byb3ZpZGVyPlxyXG4gICAgKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTXlBcHA7XHJcbiJdLCJuYW1lcyI6WyJUYXNrUHJvdmlkZXIiLCJNeUFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/_app.tsx"));
module.exports = __webpack_exports__;

})();