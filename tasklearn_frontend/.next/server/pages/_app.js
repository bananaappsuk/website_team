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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   TaskProvider: () => (/* binding */ TaskProvider),\n/* harmony export */   useTask: () => (/* binding */ useTask)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst TaskContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nconst TaskProvider = ({ children })=>{\n    const [task, setTask] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({\n        createdBy: \"\",\n        taggedStaff: \"\",\n        contributingStaff: \"\",\n        taskName: \"\",\n        history: \"\",\n        examination: \"\",\n        diagnosis: \"\",\n        plan: \"\",\n        followUp: \"\",\n        postConsultation: \"\",\n        feedback: \"\",\n        keyLearningPoint: \"\",\n        action: \"\",\n        Library: false,\n        Learn: false,\n        isShared: false,\n        isCompleted: false,\n        isDeleted: false\n    });\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(TaskContext.Provider, {\n        value: {\n            task,\n            setTask\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"E:\\\\Web develop\\\\WorkSpace\\\\new_projects\\\\tasklearn\\\\website_team\\\\tasklearn_frontend\\\\src\\\\components\\\\TaskContext.tsx\",\n        lineNumber: 54,\n        columnNumber: 9\n    }, undefined);\n};\nconst useTask = ()=>{\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(TaskContext);\n    if (!context) {\n        throw new Error(\"useTask must be used within a TaskProvider\");\n    }\n    return context;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9UYXNrQ29udGV4dC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUE4RTtBQTRCOUUsTUFBTUksNEJBQWNILG9EQUFhQSxDQUE4Qkk7QUFFeEQsTUFBTUMsZUFBa0QsQ0FBQyxFQUFFQyxRQUFRLEVBQUU7SUFDeEUsTUFBTSxDQUFDQyxNQUFNQyxRQUFRLEdBQUdOLCtDQUFRQSxDQUFPO1FBQ3JDTyxXQUFXO1FBQ1hDLGFBQWE7UUFDYkMsbUJBQW1CO1FBQ25CQyxVQUFVO1FBQ1ZDLFNBQVM7UUFDVEMsYUFBYTtRQUNiQyxXQUFXO1FBQ1hDLE1BQU07UUFDTkMsVUFBVTtRQUNWQyxrQkFBa0I7UUFDbEJDLFVBQVU7UUFDVkMsa0JBQWtCO1FBQ2xCQyxRQUFRO1FBQ1JDLFNBQVM7UUFDVEMsT0FBTztRQUNQQyxVQUFVO1FBQ1ZDLGFBQWE7UUFDYkMsV0FBVztJQUNiO0lBRUEscUJBQ0ksOERBQUN2QixZQUFZd0IsUUFBUTtRQUFDQyxPQUFPO1lBQUVyQjtZQUFNQztRQUFRO2tCQUN4Q0Y7Ozs7OztBQUdiLEVBQUU7QUFFSyxNQUFNdUIsVUFBVTtJQUNuQixNQUFNQyxVQUFVN0IsaURBQVVBLENBQUNFO0lBQzNCLElBQUksQ0FBQzJCLFNBQVM7UUFDVixNQUFNLElBQUlDLE1BQU07SUFDcEI7SUFDQSxPQUFPRDtBQUNYLEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90YXNrbGVhcm5fZnJvbnRlbmQvLi9zcmMvY29tcG9uZW50cy9UYXNrQ29udGV4dC50c3g/MDUxOSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0JztcclxuXHJcbmludGVyZmFjZSBUYXNrIHtcclxuICBjcmVhdGVkQnk6IHN0cmluZztcclxuICB0YWdnZWRTdGFmZjogc3RyaW5nO1xyXG4gIGNvbnRyaWJ1dGluZ1N0YWZmOiBzdHJpbmc7XHJcbiAgdGFza05hbWU6IHN0cmluZztcclxuICBoaXN0b3J5OiBzdHJpbmc7XHJcbiAgZXhhbWluYXRpb246IHN0cmluZztcclxuICBkaWFnbm9zaXM6IHN0cmluZztcclxuICBwbGFuOiBzdHJpbmc7XHJcbiAgZm9sbG93VXA6IHN0cmluZztcclxuICBwb3N0Q29uc3VsdGF0aW9uOiBzdHJpbmc7XHJcbiAgZmVlZGJhY2s6IHN0cmluZztcclxuICBrZXlMZWFybmluZ1BvaW50OiBzdHJpbmc7XHJcbiAgYWN0aW9uOiBzdHJpbmc7XHJcbiAgTGlicmFyeTogYm9vbGVhbjtcclxuICBMZWFybjogYm9vbGVhbjtcclxuICBpc1NoYXJlZDogYm9vbGVhbjtcclxuICBpc0NvbXBsZXRlZDogYm9vbGVhbjtcclxuICBpc0RlbGV0ZWQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBUYXNrQ29udGV4dFR5cGUge1xyXG4gICAgdGFzazogVGFzaztcclxuICAgIHNldFRhc2s6IFJlYWN0LkRpc3BhdGNoPFJlYWN0LlNldFN0YXRlQWN0aW9uPFRhc2s+PjtcclxufVxyXG5cclxuY29uc3QgVGFza0NvbnRleHQgPSBjcmVhdGVDb250ZXh0PFRhc2tDb250ZXh0VHlwZSB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcclxuXHJcbmV4cG9ydCBjb25zdCBUYXNrUHJvdmlkZXI6IFJlYWN0LkZDPHsgY2hpbGRyZW46IFJlYWN0Tm9kZSB9PiA9ICh7IGNoaWxkcmVuIH0pID0+IHtcclxuICAgIGNvbnN0IFt0YXNrLCBzZXRUYXNrXSA9IHVzZVN0YXRlPFRhc2s+KHtcclxuICAgICAgY3JlYXRlZEJ5OiBcIlwiLFxyXG4gICAgICB0YWdnZWRTdGFmZjogXCJcIixcclxuICAgICAgY29udHJpYnV0aW5nU3RhZmY6IFwiXCIsXHJcbiAgICAgIHRhc2tOYW1lOiBcIlwiLFxyXG4gICAgICBoaXN0b3J5OiBcIlwiLFxyXG4gICAgICBleGFtaW5hdGlvbjogXCJcIixcclxuICAgICAgZGlhZ25vc2lzOiBcIlwiLFxyXG4gICAgICBwbGFuOiBcIlwiLFxyXG4gICAgICBmb2xsb3dVcDogXCJcIixcclxuICAgICAgcG9zdENvbnN1bHRhdGlvbjogXCJcIixcclxuICAgICAgZmVlZGJhY2s6IFwiXCIsXHJcbiAgICAgIGtleUxlYXJuaW5nUG9pbnQ6IFwiXCIsXHJcbiAgICAgIGFjdGlvbjogXCJcIixcclxuICAgICAgTGlicmFyeTogZmFsc2UsXHJcbiAgICAgIExlYXJuOiBmYWxzZSxcclxuICAgICAgaXNTaGFyZWQ6IGZhbHNlLFxyXG4gICAgICBpc0NvbXBsZXRlZDogZmFsc2UsXHJcbiAgICAgIGlzRGVsZXRlZDogZmFsc2UsXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUYXNrQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17eyB0YXNrLCBzZXRUYXNrIH19PlxyXG4gICAgICAgICAgICB7Y2hpbGRyZW59XHJcbiAgICAgICAgPC9UYXNrQ29udGV4dC5Qcm92aWRlcj5cclxuICAgICk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgdXNlVGFzayA9ICgpID0+IHtcclxuICAgIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFRhc2tDb250ZXh0KTtcclxuICAgIGlmICghY29udGV4dCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndXNlVGFzayBtdXN0IGJlIHVzZWQgd2l0aGluIGEgVGFza1Byb3ZpZGVyJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29udGV4dDtcclxufTtcclxuIl0sIm5hbWVzIjpbIlJlYWN0IiwiY3JlYXRlQ29udGV4dCIsInVzZUNvbnRleHQiLCJ1c2VTdGF0ZSIsIlRhc2tDb250ZXh0IiwidW5kZWZpbmVkIiwiVGFza1Byb3ZpZGVyIiwiY2hpbGRyZW4iLCJ0YXNrIiwic2V0VGFzayIsImNyZWF0ZWRCeSIsInRhZ2dlZFN0YWZmIiwiY29udHJpYnV0aW5nU3RhZmYiLCJ0YXNrTmFtZSIsImhpc3RvcnkiLCJleGFtaW5hdGlvbiIsImRpYWdub3NpcyIsInBsYW4iLCJmb2xsb3dVcCIsInBvc3RDb25zdWx0YXRpb24iLCJmZWVkYmFjayIsImtleUxlYXJuaW5nUG9pbnQiLCJhY3Rpb24iLCJMaWJyYXJ5IiwiTGVhcm4iLCJpc1NoYXJlZCIsImlzQ29tcGxldGVkIiwiaXNEZWxldGVkIiwiUHJvdmlkZXIiLCJ2YWx1ZSIsInVzZVRhc2siLCJjb250ZXh0IiwiRXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/components/TaskContext.tsx\n");

/***/ }),

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _components_TaskContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/TaskContext */ \"./src/components/TaskContext.tsx\");\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_TaskContext__WEBPACK_IMPORTED_MODULE_1__.TaskProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"E:\\\\Web develop\\\\WorkSpace\\\\new_projects\\\\tasklearn\\\\website_team\\\\tasklearn_frontend\\\\src\\\\pages\\\\_app.tsx\",\n            lineNumber: 6,\n            columnNumber: 13\n        }, this)\n    }, void 0, false, {\n        fileName: \"E:\\\\Web develop\\\\WorkSpace\\\\new_projects\\\\tasklearn\\\\website_team\\\\tasklearn_frontend\\\\src\\\\pages\\\\_app.tsx\",\n        lineNumber: 5,\n        columnNumber: 9\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDeUQ7QUFDekQsU0FBU0MsTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUM3QyxxQkFDSSw4REFBQ0gsaUVBQVlBO2tCQUNULDRFQUFDRTtZQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7O0FBR3BDO0FBRUEsaUVBQWVGLEtBQUtBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90YXNrbGVhcm5fZnJvbnRlbmQvLi9zcmMvcGFnZXMvX2FwcC50c3g/ZjlkNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJztcclxuaW1wb3J0IHsgVGFza1Byb3ZpZGVyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9UYXNrQ29udGV4dCc7XHJcbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRhc2tQcm92aWRlcj5cclxuICAgICAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxyXG4gICAgICAgIDwvVGFza1Byb3ZpZGVyPlxyXG4gICAgKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTXlBcHA7XHJcbiJdLCJuYW1lcyI6WyJUYXNrUHJvdmlkZXIiLCJNeUFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

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