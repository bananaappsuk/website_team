"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
var react_1 = require("react");
var image_1 = require("next/image");
var hi_1 = require("react-icons/hi");
var Vector_png_1 = require("../assets/Quiz/Vector.png");
var remove_user_jpg_1 = require("../assets/home/remove-user.jpg");
var hi_2 = require("react-icons/hi");
var TaskContext_1 = require("../components/TaskContext");
var axios_1 = require("axios");
var react_toastify_1 = require("react-toastify");
var firestore_1 = require("firebase/firestore");
var firebase_1 = require("../firebase");
var router_1 = require("next/router");
var icon_png_1 = require("../assets/home/icon.png");
var auth_1 = require("firebase/auth");
var rx_1 = require("react-icons/rx");
var TaskSection = function (_a) {
    var refreshTrigger = _a.refreshTrigger, server = _a.server, setselectedTask = _a.setselectedTask, selectedTask = _a.selectedTask, taskCategories = _a.taskCategories, filteredTasks = _a.filteredTasks, dropdownVisible = _a.dropdownVisible, setDropdownVisible = _a.setDropdownVisible, handleTasksClick = _a.handleTasksClick, setShowForm = _a.setShowForm, filter = _a.filter, setFilter = _a.setFilter, fetchTasks = _a.fetchTasks, taskLoading = _a.taskLoading, showQuiz = _a.showQuiz, setShowQuiz = _a.setShowQuiz, setSelectedQuizTaskId = _a.setSelectedQuizTaskId, setBtnDisble = _a.setBtnDisble, setFilteredTasks = _a.setFilteredTasks, quizzes = _a.quizzes, fetchUsername = _a.fetchUsername, fetchUsernames = _a.fetchUsernames, userData = _a.userData, setTaggedStaffTags = _a.setTaggedStaffTags, setContributingTags = _a.setContributingTags, handleResetInputs = _a.handleResetInputs;
    var _b = react_1.useState(false), exitPopupOpen = _b[0], setExitPopupOpen = _b[1];
    var _c = react_1.useState(false), removePopupOpen = _c[0], setRemovePopupOpen = _c[1];
    var _d = react_1.useState(null), userToRemove = _d[0], setUserToRemove = _d[1];
    var _e = react_1.useState(""), removeMsgText = _e[0], setRemoveMsgText = _e[1];
    var _f = react_1.useState([]), serverMembers = _f[0], setServerMembers = _f[1];
    var userId = userData ? userData.uid : null;
    var _g = TaskContext_1.useTask(), task = _g.task, setTask = _g.setTask, selectedServerId = _g.selectedServerId;
    var _h = react_1.useState(""), searchTerm = _h[0], setSearchTerm = _h[1];
    var _j = react_1.useState([]), filteredUsers = _j[0], setFilteredUsers = _j[1];
    var _k = react_1.useState(false), showResults = _k[0], setShowResults = _k[1];
    var searchRef = react_1.useRef(null);
    var _l = react_1.useState(false), isOpen = _l[0], setIsOpen = _l[1];
    var ServerDropdownRef = react_1.useRef(null);
    var router = router_1.useRouter();
    var id = router.query.id;
    var _m = react_1.useState([]), servers = _m[0], setServers = _m[1];
    var _o = react_1.useState(""), inviteLink = _o[0], setInviteLink = _o[1];
    var _p = react_1.useState(false), showPopup = _p[0], setShowPopup = _p[1];
    var _q = react_1.useState("Copy"), buttonText = _q[0], setButtonText = _q[1];
    var _r = react_1.useState([]), filteredSearchTask = _r[0], setFilteredSearchTask = _r[1];
    var _s = react_1.useState([]), filteredPatientId = _s[0], setFilteredPatientId = _s[1];
    var _t = react_1.useState({}), createdByDetails = _t[0], setCreatedByDetails = _t[1];
    var _u = react_1.useState(false), deletePopupOpen = _u[0], setDeletePopupOpen = _u[1];
    var _v = react_1.useState("Are you sure you want to delete this task and move it to the deleted tasks?"), deleteMsgText = _v[0], setDeleteMsgText = _v[1];
    var _w = react_1.useState(null), taskToDelete = _w[0], setTaskToDelete = _w[1];
    var _x = react_1.useState(null), taskToDeleted = _x[0], setTaskToDeleted = _x[1];
    var _y = react_1.useState(null), serverToDelete = _y[0], setServerToDelete = _y[1];
    var _z = react_1.useState(null), user = _z[0], setUser = _z[1];
    react_1.useEffect(function () {
        // Reset the search term and results whenever refreshTrigger changes
        setSearchTerm("");
        setShowResults(false);
        setFilteredPatientId([]);
    }, [refreshTrigger]);
    var fetchUsernames2 = function (uids) { return __awaiter(void 0, void 0, Promise, function () {
        var promises;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    promises = uids.map(function (uid) { return __awaiter(void 0, void 0, void 0, function () {
                        var userDoc;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, firestore_1.getDoc(firestore_1.doc(firebase_1.db, "users", uid))];
                                case 1:
                                    userDoc = _b.sent();
                                    return [2 /*return*/, (_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.userName];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(promises)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    var fetchJobRole = function (uids) { return __awaiter(void 0, void 0, Promise, function () {
        var promises;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    promises = uids.map(function (uid) { return __awaiter(void 0, void 0, void 0, function () {
                        var userDoc;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, firestore_1.getDoc(firestore_1.doc(firebase_1.db, "users", uid))];
                                case 1:
                                    userDoc = _b.sent();
                                    return [2 /*return*/, (_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.jobRole];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(promises)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    var toggleOpen = function () {
        setIsOpen(!isOpen);
    };
    var handleDropdown = function (index, item) {
        if (task === null || task === void 0 ? void 0 : task.isCompleted) {
            setselectedTask(true);
        }
        var newDropdownVisible = __spreadArrays(dropdownVisible); // Creating a new dropdown visibility array
        // Toggle the dropdown visibility for the clicked item
        newDropdownVisible[index] = !newDropdownVisible[index];
        setDropdownVisible(newDropdownVisible);
        if (!newDropdownVisible[index]) {
            // If the dropdown is closing, clear filtered tasks for the selected category
            if (item !== "Server Member List") {
                setFilteredTasks(function (prev) {
                    var _a;
                    return (__assign(__assign({}, prev), (_a = {}, _a[item] = [], _a)));
                });
            }
        }
        else {
            // If the dropdown is opening, fetch tasks or server members
            if (item === "Server Member List") {
                // When "Server Member List" is clicked, fetch server members
                fetchServerMembers();
            }
            else {
                // Otherwise, fetch tasks for the selected category
                fetchTasks(item);
            }
        }
    };
    react_1.useEffect(function () {
        var handleClickOutside = function (event) {
            if (ServerDropdownRef.current &&
                !ServerDropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return function () {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    react_1.useEffect(function () {
        var handleClickOutside = function (event) {
            if (searchRef.current &&
                !searchRef.current.contains(event.target)) {
                setShowResults(false); // Clear search results when clicking outside
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return function () {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    react_1.useEffect(function () {
        var fetchAndSearchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var trimmedSearchTerm, isUserSearch, query, auth_2, user_1, token, taskResponse, data, filterDeletedData, uids, userDetails_1, updatedPatientIdTask, regex_1, newSets, error_1, auth_3, user_2, token, response, tasks, uids, userDetails_2, updatedPatientIdTask, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        trimmedSearchTerm = searchTerm.trim();
                        // Case 1: Clear results when input is empty
                        if (!trimmedSearchTerm) {
                            setFilteredPatientId([]); // Clear previous results
                            setShowResults(false); // Hide dropdown for empty input
                            return [2 /*return*/];
                        }
                        // Case 2: No server selected
                        if (!(server === null || server === void 0 ? void 0 : server.serverId)) {
                            setFilteredPatientId([]); // Clear results when no server is selected
                            setShowResults(true); // Hide dropdown when no server is selected
                            return [2 /*return*/];
                        }
                        isUserSearch = trimmedSearchTerm.startsWith("@");
                        query = isUserSearch
                            ? trimmedSearchTerm.substring(1) // Remove '@' for user search
                            : trimmedSearchTerm;
                        if (!(isUserSearch && query.length > 0)) return [3 /*break*/, 8];
                        auth_2 = auth_1.getAuth();
                        user_1 = auth_2.currentUser;
                        if (!user_1) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, user_1.getIdToken()];
                    case 1:
                        token = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_API_URL + "/api/tasks/server/" + (server === null || server === void 0 ? void 0 : server.serverId), {
                                method: "GET",
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 3:
                        taskResponse = _b.sent();
                        return [4 /*yield*/, taskResponse.json()];
                    case 4:
                        data = _b.sent();
                        filterDeletedData = data.filter(function (task) { return !task.isDeleted; });
                        uids = filterDeletedData.map(function (task) { return task.createdBy; });
                        return [4 /*yield*/, fetchUsernames2(uids)];
                    case 5:
                        userDetails_1 = _b.sent();
                        updatedPatientIdTask = filterDeletedData.map(function (task, index) { return (__assign(__assign({}, task), { createdBy: userDetails_1[index] })); });
                        regex_1 = new RegExp(query, "i");
                        newSets = updatedPatientIdTask.filter(function (task) {
                            return regex_1.test(task.createdBy);
                        });
                        setFilteredPatientId(newSets);
                        setShowResults(true);
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _b.sent();
                        console.error("Error fetching tasks:", error_1);
                        setFilteredPatientId([]);
                        setShowResults(false);
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 15];
                    case 8:
                        _b.trys.push([8, 14, , 15]);
                        auth_3 = auth_1.getAuth();
                        user_2 = auth_3.currentUser;
                        if (!user_2) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, user_2.getIdToken()];
                    case 9:
                        token = _b.sent();
                        return [4 /*yield*/, axios_1["default"].get(process.env.NEXT_PUBLIC_API_URL + "/api/tasks/search", {
                                params: {
                                    query: query,
                                    serverId: server.serverId
                                },
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 10:
                        response = _b.sent();
                        if (!(response.status === 200 && response.data)) return [3 /*break*/, 12];
                        tasks = response.data;
                        uids = tasks.map(function (task) { return task.createdBy; });
                        return [4 /*yield*/, fetchUsernames2(uids)];
                    case 11:
                        userDetails_2 = _b.sent();
                        updatedPatientIdTask = tasks.map(function (task, index) { return (__assign(__assign({}, task), { createdBy: userDetails_2[index] })); });
                        setFilteredPatientId(updatedPatientIdTask);
                        setShowResults(true);
                        return [3 /*break*/, 13];
                    case 12:
                        setFilteredPatientId([]); // Clear results for invalid responses
                        setShowResults(false); // Hide dropdown for invalid responses
                        _b.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        error_2 = _b.sent();
                        if (axios_1["default"].isAxiosError(error_2)) {
                            // Axios-specific error handling
                            console.error("Axios Error:", ((_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data) || error_2.message);
                        }
                        else {
                            // Generic error handling
                            console.error("Unexpected Error:", error_2);
                        }
                        setFilteredPatientId([]); // Clear results on error
                        setShowResults(false); // Hide dropdown on error
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/];
                }
            });
        }); };
        // Debounce to avoid rapid API calls
        var delayDebounce = setTimeout(function () {
            fetchAndSearchData(); // Call the async function after debounce delay
        }, 50); // 300ms debounce delay
        return function () {
            clearTimeout(delayDebounce); // Clear timeout on cleanup
        };
    }, [searchTerm, server === null || server === void 0 ? void 0 : server.serverId]); // Trigger when searchTerm or serverId changes
    react_1.useEffect(function () {
        var handleClickOutside = function (event) {
            if (searchRef.current &&
                !searchRef.current.contains(event.target)) {
                setShowResults(false); // Clear search results when clicking outside
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return function () {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    var fetchTaskById = function (taskId) { return __awaiter(void 0, void 0, void 0, function () {
        var auth_4, user_3, token, response, data, _a, taggedStaffDetails, contributingStaffDetails, createdByDetails_1, updatedTask, updatedTask_1, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    auth_4 = auth_1.getAuth();
                    user_3 = auth_4.currentUser;
                    if (!user_3) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, user_3.getIdToken()];
                case 1:
                    token = _b.sent();
                    return [4 /*yield*/, axios_1["default"].get(process.env.NEXT_PUBLIC_API_URL + "/api/task/" + taskId, {
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })];
                case 2:
                    response = _b.sent();
                    if (!response) return [3 /*break*/, 5];
                    return [4 /*yield*/, response.data];
                case 3:
                    data = _b.sent();
                    return [4 /*yield*/, Promise.all([
                            fetchUsernames(data.taggedStaff),
                            fetchUsernames(data.contributingStaff),
                            fetchUsername(data.createdBy),
                        ])];
                case 4:
                    _a = _b.sent(), taggedStaffDetails = _a[0], contributingStaffDetails = _a[1], createdByDetails_1 = _a[2];
                    updatedTask = __assign(__assign({}, data), { taggedStaff: taggedStaffDetails, contributingStaff: contributingStaffDetails, createdBy: createdByDetails_1 });
                    if (response.data._id === taskId) {
                        setSelectedQuizTaskId(response.data._id);
                        if ((updatedTask.taggedStaff.includes(userData === null || userData === void 0 ? void 0 : userData.userName) &&
                            !updatedTask.isCompleted) ||
                            (updatedTask.contributingStaff.includes(userData === null || userData === void 0 ? void 0 : userData.userName) &&
                                !updatedTask.isCompleted)) {
                            setContributingTags(__spreadArrays(updatedTask.contributingStaff));
                            setTask(__assign(__assign({}, data), { taggedStaff: taggedStaffDetails, contributingStaff: data.contributingStaff, createdBy: createdByDetails_1 }));
                            setselectedTask(false);
                        }
                        else {
                            updatedTask_1 = __assign(__assign({}, data), { taggedStaff: taggedStaffDetails, contributingStaff: contributingStaffDetails, createdBy: createdByDetails_1 });
                            setContributingTags([]);
                            setTask(updatedTask_1);
                            setselectedTask(true);
                        }
                        setShowForm(true);
                        setBtnDisble(false);
                    }
                    else {
                        setselectedTask(false);
                        setSelectedQuizTaskId("");
                    }
                    _b.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_3 = _b.sent();
                    react_toastify_1.toast.error(error_3.message);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteTask = function () { return __awaiter(void 0, void 0, void 0, function () {
        var auth, user, token, response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    auth = auth_1.getAuth();
                    user = auth.currentUser;
                    if (!user) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, user.getIdToken()];
                case 1:
                    token = _a.sent();
                    if (!taskToDelete) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_API_URL + "/api/tasks/" + taskToDelete.id, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + token
                            }
                        })];
                case 3:
                    response = _a.sent();
                    if (response.ok) {
                        setFilter(function (prevFilter) {
                            if (prevFilter === "Pending Tasks") {
                                return "Pending Tasks";
                            }
                            else if (prevFilter === "Completed Tasks") {
                                return "Completed Tasks";
                            }
                            else if (prevFilter === "Learning") {
                                return "Learning";
                            }
                            else {
                                return "All Tasks";
                            }
                        });
                        fetchTasks(taskToDelete.filter);
                        fetchTasks("Deleted Tasks");
                        fetchTasks("All Tasks");
                        fetchTasks("Learning");
                        fetchTasks("Pending Tasks");
                        fetchTasks("Completed Tasks");
                        setDeletePopupOpen(false);
                        setTaskToDelete(null);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    react_toastify_1.toast.error(error_4.message);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteQuiz = function (taskId) { return __awaiter(void 0, void 0, void 0, function () {
        var auth, user, token, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    auth = auth_1.getAuth();
                    user = auth.currentUser;
                    if (!user) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, user.getIdToken()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_API_URL + "/api/convertQuizzes/task/" + taskId, {
                            method: "DELETE",
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        handleTasksClick("Deleted Tasks");
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    //delete the task from dB
    var handleDeletedTask = function (taskId) { return __awaiter(void 0, void 0, void 0, function () {
        var auth_5, user_4, token, response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    auth_5 = auth_1.getAuth();
                    user_4 = auth_5.currentUser;
                    if (!user_4) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, user_4.getIdToken()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_API_URL + "/api/tasks/" + taskId, {
                            method: "DELETE",
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        handleDeleteQuiz(taskId);
                        fetchTasks(filter);
                        fetchTasks("Deleted Tasks");
                        setDeletePopupOpen(false);
                        setTaskToDeleted(null);
                        handleResetInputs();
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    react_toastify_1.toast.error(error_5.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function (newItem, filter) {
        if (!newItem.isDeleted) {
            setDeleteMsgText("Are you sure you want to delete this task and move it to the deleted tasks?");
            setDeletePopupOpen(true);
            setTaskToDelete({ id: newItem._id, filter: filter });
        }
        if (newItem.isDeleted) {
            setDeleteMsgText("Are you sure you want to permanently delete this task? Can't recover the task again!");
            setDeletePopupOpen(true);
            setTaskToDeleted({ id: newItem._id });
        }
    };
    var handleDeleteServer = function (server) {
        setDeleteMsgText("Are you sure you want to delete the server \"" + server.serverName + "\"? This action cannot be undone.");
        setDeletePopupOpen(true);
        setServerToDelete(server);
    };
    var handleConfirmClick = function () {
        if (taskToDelete) {
            handleDeleteTask();
        }
        if (taskToDeleted) {
            handleDeletedTask(taskToDeleted.id);
        }
        if (serverToDelete) {
            handleDeletedServer(serverToDelete.serverId);
        }
    };
    var handleDeletedServer = function (serverId) { return __awaiter(void 0, void 0, void 0, function () {
        var auth_6, user_5, token, response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    auth_6 = auth_1.getAuth();
                    user_5 = auth_6.currentUser;
                    if (!user_5) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, user_5.getIdToken()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, axios_1["default"]["delete"](process.env.NEXT_PUBLIC_API_URL + "/api/servers/" + serverId, {
                            method: "DELETE",
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })];
                case 2:
                    response = _a.sent();
                    react_toastify_1.toast.success(response.data.message || 'Server deleted successfully!');
                    window.location.reload();
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    setDeletePopupOpen(false);
                    setServerToDelete(null);
                    return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        var fetchServer = function () { return __awaiter(void 0, void 0, void 0, function () {
            var auth_7, user_6, token, response, data, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        auth_7 = auth_1.getAuth();
                        user_6 = auth_7.currentUser;
                        if (!user_6) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, user_6.getIdToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_API_URL + "/api/servers/" + id, {
                                headers: {
                                    Authorization: "Bearer " + token
                                }
                            })];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        setServers(data);
                        return [3 /*break*/, 5];
                    case 4:
                        error_7 = _a.sent();
                        console.error("Error fetching server:", error_7);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        if (id)
            fetchServer();
    }, [id]);
    var generateInviteLink = function () {
        var link = window.location.origin + "/join/" + (server === null || server === void 0 ? void 0 : server.serverId);
        setInviteLink(link.startsWith("http") ? link : "https://" + link);
        setShowPopup(true);
    };
    var copyToClipboard = function () {
        navigator.clipboard
            .writeText(inviteLink)
            .then(function () {
            setButtonText("Copied"); // Change the button text
            // Reset the button text after a delay (optional)
            setTimeout(function () { return setButtonText("Copy"); }, 2000); // Resets to "Copy" after 2 seconds
        })["catch"](function (err) { return console.error("Failed to copy: ", err); });
    };
    var closePopup = function () { return setShowPopup(false); };
    var shareLink = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.share({
                            title: "Invite Link",
                            text: inviteLink
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        var currentUser = firebase_1.auth.currentUser;
        if (currentUser) {
            setUser({
                uid: currentUser.uid,
                email: currentUser.email || "",
                userName: currentUser.displayName || "",
                jobRole: "",
                profilePicUrl: currentUser.photoURL || undefined
            });
        }
    }, []);
    var fetchServerMembers = function () { return __awaiter(void 0, void 0, void 0, function () {
        var auth_8, user_7, token, serverId, response, usernames_1, jobRoles_1, membersWithUsernames, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    auth_8 = auth_1.getAuth();
                    user_7 = auth_8.currentUser;
                    if (!user_7)
                        return [2 /*return*/];
                    return [4 /*yield*/, user_7.getIdToken()];
                case 1:
                    token = _a.sent();
                    serverId = server === null || server === void 0 ? void 0 : server.serverId;
                    return [4 /*yield*/, axios_1["default"].get(process.env.NEXT_PUBLIC_API_URL + "/api/servers/" + serverId + "/server-members", {
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })];
                case 2:
                    response = _a.sent();
                    if (!(response.status === 200)) return [3 /*break*/, 5];
                    console.log("Fetched server members:", response.data);
                    return [4 /*yield*/, fetchUsernames2(response.data.members)];
                case 3:
                    usernames_1 = _a.sent();
                    return [4 /*yield*/, fetchJobRole(response.data.members)];
                case 4:
                    jobRoles_1 = _a.sent();
                    membersWithUsernames = response.data.members.map(function (memberId, index) { return ({
                        userId: memberId,
                        username: usernames_1[index],
                        jobRole: jobRoles_1[index]
                    }); });
                    console.log("Username", usernames_1);
                    console.log("Job Role", jobRoles_1);
                    setServerMembers(membersWithUsernames); // Store members with usernames
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_8 = _a.sent();
                    react_toastify_1.toast.error("Failed to fetch server members");
                    console.error("Error fetching server members:", error_8);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Fetch members when `server` changes
    react_1.useEffect(function () {
        if (server) {
            fetchServerMembers();
        }
    }, [server]);
    var handleRemoveServerMember = function (serverId, userId) { return __awaiter(void 0, void 0, Promise, function () {
        var auth_9, user_8, token, response, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    auth_9 = auth_1.getAuth();
                    user_8 = auth_9.currentUser;
                    if (!user_8) {
                        react_toastify_1.toast.error('User not authenticated');
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, user_8.getIdToken()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, axios_1["default"]["delete"](process.env.NEXT_PUBLIC_API_URL + "/api/servers/" + serverId + "/remove-member/" + userId, {
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })];
                case 2:
                    response = _a.sent();
                    if (response.status === 200) {
                        return [2 /*return*/, {
                                serverName: response.data.serverName,
                                username: response.data.username
                            }];
                    }
                    return [2 /*return*/, null];
                case 3:
                    error_9 = _a.sent();
                    console.error('Error removing user from server:', error_9);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleRemoveUserClick = function (member) {
        setRemoveMsgText("Are you sure you want to remove \"" + member.username + "\" from the server?");
        setUserToRemove(member);
        setRemovePopupOpen(true);
    };
    var handleConfirmRemoveUser = function () { return __awaiter(void 0, void 0, void 0, function () {
        var username, userId, removed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!server || !userToRemove) {
                        react_toastify_1.toast.error("Server not found or user missing.");
                        return [2 /*return*/];
                    }
                    username = userToRemove.username, userId = userToRemove.userId;
                    return [4 /*yield*/, handleRemoveServerMember(server.serverId, userId)];
                case 1:
                    removed = _a.sent();
                    if (removed) {
                        react_toastify_1.toast.success("Successfully removed \"" + username + "\" from the server");
                        // setServerMembers(prev => prev.filter(member => member.userId !== userId));
                        setServerMembers(function (prev) {
                            return prev.filter(function (member) { return member.userId !== userId; });
                        });
                    }
                    else {
                        react_toastify_1.toast.error("Failed to remove \"" + username + "\" from the server");
                    }
                    setRemovePopupOpen(false);
                    setUserToRemove(null);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleExitServer = function (serverId) { return __awaiter(void 0, void 0, void 0, function () {
        var auth, user, token, response, updatedServer, error_10;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    auth = auth_1.getAuth();
                    user = auth.currentUser;
                    if (!user) {
                        react_toastify_1.toast.error("You must be logged in to exit the server.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, user.getIdToken()];
                case 1:
                    token = _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, axios_1["default"]["delete"](process.env.NEXT_PUBLIC_API_URL + "/api/servers/" + serverId + "/exit", {
                            headers: {
                                Authorization: "Bearer " + token,
                                'Content-Type': 'application/json'
                            }
                        })];
                case 3:
                    response = _c.sent();
                    updatedServer = response.data.updatedServer;
                    console.log("Response updatedServer:", updatedServer);
                    if (updatedServer) {
                        if (updatedServer.isDeleted) {
                            react_toastify_1.toast.success('The server has been successfully deleted.');
                            setServers(function (prevServers) {
                                var filtered = prevServers.filter(function (server) { return server._id !== serverId; });
                                return filtered;
                            });
                        }
                        else {
                            react_toastify_1.toast.info('You have successfully exited the server.');
                        }
                        router.push('/');
                    }
                    else {
                        react_toastify_1.toast.error('Unable to update server details.');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_10 = _c.sent();
                    console.error("Error exiting server:", error_10);
                    react_toastify_1.toast.error(((_b = (_a = error_10.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Something went wrong.");
                    return [3 /*break*/, 5];
                case 5:
                    setExitPopupOpen(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("div", null,
        deletePopupOpen && (react_1["default"].createElement("div", { className: "fixed inset-[-60px] bg-gray-800 bg-opacity-75 flex justify-center items-center z-10 text-black" },
            react_1["default"].createElement("div", { className: "relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl" },
                react_1["default"].createElement("h1", { className: "text-center font-bold" }, deleteMsgText),
                react_1["default"].createElement("div", { className: "mt-5 flex justify-center gap-x-6" },
                    react_1["default"].createElement("button", { className: " text-white py-1 px-5 rounded-md hover:bg-red-600 bg-[#D26767] font-semibold transition duration-300", onClick: handleConfirmClick }, "Remove"),
                    react_1["default"].createElement("button", { className: " text-white bg-[#68A86B] hover:bg-gray-600 py-1 px-5 rounded-md font-semibold $transition duration-300", onClick: function () {
                            setTaskToDelete(null);
                            setTaskToDeleted(null);
                            setDeletePopupOpen(false);
                            setServerToDelete(null);
                        } }, "Cancel"))))),
        server ? (react_1["default"].createElement("div", { ref: ServerDropdownRef, className: "w-full max-w-md mx-auto" },
            react_1["default"].createElement("div", { className: "flex items-center justify-between px-2 sm:px-4 py-1 cursor-pointer gap-4 sm:gap-10 sm:gap-0", onClick: toggleOpen },
                react_1["default"].createElement("span", { className: "mt-2 sm:mt-0 text-md font-bold text-black text-[6px] sm:text-[7px] md:text-[10px] lg:text-[14px] xl:text-[16px]" }, server.serverName),
                server && (user === null || user === void 0 ? void 0 : user.uid) === server.createdByUserId && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("div", { className: "sm:hidden relative group" },
                        react_1["default"].createElement("button", { className: "h-1 w-1", onClick: function () { return handleDeleteServer({ serverId: server.serverId, serverName: server.serverName }); } },
                            react_1["default"].createElement(image_1["default"], { src: Vector_png_1["default"], alt: "Delete", className: "" }))),
                    react_1["default"].createElement("div", { className: "hidden sm:block ml-auto relative group" },
                        react_1["default"].createElement("button", { className: "flex items-center h-1 w-1 md:h-2 md:w-2 lg:h-3 lg:w-3 xl:h-3 xl:w-3", onClick: function () { return handleDeleteServer({ serverId: server.serverId, serverName: server.serverName }); } },
                            react_1["default"].createElement(image_1["default"], { src: Vector_png_1["default"], alt: "Delete", className: "ml-8" }))))),
                server && (user === null || user === void 0 ? void 0 : user.uid) !== server.createdByUserId && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(rx_1.RxExit, { onClick: function () { return setExitPopupOpen(true); }, className: "flex items-center ml-auto text-[#67A76B] hover:text-green-700 " }))),
                isOpen ? (react_1["default"].createElement(hi_2.HiChevronDown, { className: "mt-2 sm:mt-0 h-2 w-2 sm:w-3 sm:h-3 lg:h-4 lg:w-4 xl:h-5 xl:w-5 text-gray-600" })) : (react_1["default"].createElement(hi_1.HiChevronRight, { className: "mt-2 sm:mt-0 h-2 w-2 sm:w-3 sm:h-3 lg:h-4 lg:w-4 xl:h-5 xl:w-5 text-gray-600" }))),
            isOpen && (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement("div", { onClick: generateInviteLink, className: "bg-[#F4F4F4] flex items-center cursor-pointer" },
                    react_1["default"].createElement("div", { className: "px-2 py-3 lg:px-4 lg:py-6 text-black text-[6px] sm:text-[10px] lg:text-[14px] xl:text-[16px] " }, "Invite Link"),
                    react_1["default"].createElement("div", { className: "px-3 py-1 sm:px-5 sm:py-6 ml-auto" },
                        react_1["default"].createElement(image_1["default"], { src: icon_png_1["default"], alt: "plus", className: "w-1 h-1 sm:w-2 sm:h-2 lg:w-2 lg:h-2 xl:w-3 xl:h-3" }))))),
            showPopup && (react_1["default"].createElement("div", { className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10" },
                react_1["default"].createElement("div", { className: "relative w-full max-w-xl px-8 py-12 bg-white rounded shadow-lg text-black" },
                    react_1["default"].createElement("div", { className: "flex" },
                        react_1["default"].createElement("h2", { className: "text-lg sm:text-xl font-bold mb-4" },
                            "Invite friends to ",
                            server.serverName + "'s",
                            " Server",
                            " "),
                        react_1["default"].createElement(hi_2.HiX, { className: "ml-auto text-black hover:text-gray-800 focus:outline-none cursor-pointer", onClick: closePopup })),
                    react_1["default"].createElement("p", { className: "text-gray-600 text-sm mb-4" }, "Share this link with others to grant access to your server!"),
                    react_1["default"].createElement("div", { className: "relative flex items-center bg-[#EBEBEB] px-3 py-3" },
                        react_1["default"].createElement("input", { type: "text", value: inviteLink, readOnly: true, className: "bg-transparent flex-1 outline-none text-gray-700 text-sm" // Extra padding on the right for button space
                         }),
                        react_1["default"].createElement("button", { onClick: copyToClipboard, className: "absolute right-0 mr-2 bg-[#68A86B] border border-[#68A86B] text-white font-semibold rounded-sm px-4 py-1 text-sm hover:bg-green-100 hover:text-black" }, buttonText)),
                    react_1["default"].createElement("div", { className: "mt-12 flex justify-center" },
                        react_1["default"].createElement("button", { onClick: shareLink, className: "w-[20%] bg-[#68A86B] border border-[#68A86B] text-white px-4 py-2 rounded-lg hover:bg-green-100 hover:text-black" }, "Share"))))))) : (react_1["default"].createElement("h1", { className: "flex items-center justify-between px-4 py-1 text-black" })),
        react_1["default"].createElement("div", { ref: searchRef, className: "p-2 relative" },
            react_1["default"].createElement("input", { type: "text", placeholder: "Search @ User, Patient ID...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, onFocus: function () { return setShowResults(true); }, className: "w-full p-1 border border-gray-300 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEBEBE]" }),
            showResults && (react_1["default"].createElement("div", { className: "absolute w-[78%] sm:w-[85%] md:w-[90%] lg:w-[87%] xl:w-[93%] bg-white text-black shadow-lg rounded-lg mt-2 max-h-60 overflow-y-auto" }, !(server === null || server === void 0 ? void 0 : server.serverId) ? (react_1["default"].createElement("div", { className: "p-2 text-gray-500" }, "You must select a server to search tasks")) : searchTerm === "" ? (react_1["default"].createElement("div", { className: "" })) : filteredPatientId.length > 0 ? (filteredPatientId.map(function (task, index) {
                return task.message ? ( // Check if it's a message object
                react_1["default"].createElement("div", { key: index, className: "p-2 text-gray-500" }, task.message)) : (react_1["default"].createElement("div", { key: index, className: "w-full p-1 border-b cursor-pointer hover:bg-gray-100 text-[8px] sm:text-[10px] md:text-[11px] lg:text-[10px] xl:text-[12px] ", onClick: function () {
                        fetchTaskById(task._id);
                        setShowResults(false);
                    } },
                    react_1["default"].createElement("p", { className: "flex font-semibold" },
                        react_1["default"].createElement("span", { className: "hidden lg:block" }, "Task Code: "),
                        react_1["default"].createElement("span", { className: "lg:ml-1" }, task.patientId)),
                    react_1["default"].createElement("p", { className: "flex font-semibold text-gray-900" },
                        react_1["default"].createElement("span", { className: "hidden lg:block" }, "Created by: "),
                        react_1["default"].createElement("span", { className: "lg:ml-1" }, task.createdBy || "Loading...")),
                    react_1["default"].createElement("p", { className: "flex font-semibold text-gray-900" },
                        react_1["default"].createElement("span", { className: "hidden lg:block" }, "Task Name: "),
                        react_1["default"].createElement("span", { className: "lg:ml-1" }, task.taskName || "Loading..."))));
            })) : (react_1["default"].createElement("div", { className: "p-2 text-gray-500" }, "No matching tasks found"))))),
        server ? (react_1["default"].createElement("div", { className: "mt-2" },
            react_1["default"].createElement("ul", { className: "px-1 space-y-2 sm:px-2 sm:space-y-2 md:px-3 md:space-y-3 lg:px-4 lg:space-y-4" }, taskCategories.map(function (item, index) {
                var _a;
                return (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("li", { key: item, onClick: function () {
                            handleTasksClick(item);
                            handleDropdown(index, item);
                        }, className: "text-[6px] sm:text-[7px] md:text-[10px] lg:text-[12px] xl:text-[16px] flex justify-between items-center text-black font-bold cursor-pointer" },
                        item,
                        dropdownVisible[index] ? (react_1["default"].createElement(hi_2.HiChevronDown, null)) : (react_1["default"].createElement(hi_1.HiChevronRight, null))),
                    dropdownVisible[index] && ((_a = filteredTasks[item]) === null || _a === void 0 ? void 0 : _a.map(function (newItem, index) {
                        return (react_1["default"].createElement(react_1["default"].Fragment, null,
                            react_1["default"].createElement("div", { key: index, className: "text-black justify-between flex " },
                                react_1["default"].createElement("p", { className: "text-[6px] sm:text-[7px] lg:text-[12px] xl:text-[16px] cursor-pointer hover:text-[#68A86B] " + (newItem._id === (task === null || task === void 0 ? void 0 : task._id)
                                        ? "text-[#68A86B] font-semibold"
                                        : ""), onClick: function () { return fetchTaskById(newItem._id); } }, newItem && (newItem === null || newItem === void 0 ? void 0 : newItem.patientId)),
                                react_1["default"].createElement(image_1["default"], { className: " object-contain w-[5px] sm:w-[8px] lg:w-[12px] xl:w-[16px] cursor-pointer", src: Vector_png_1["default"], alt: "delete", onClick: function () { return handleDelete(newItem, item); } }))));
                    })),
                    dropdownVisible[index] && item === "Server Member List" &&
                        (user === null || user === void 0 ? void 0 : user.uid) === server.createdByUserId &&
                        (react_1["default"].createElement("div", { className: "text-black justify-between flex flex-col space-y-2" }, serverMembers === null || serverMembers === void 0 ? void 0 : serverMembers.filter(function (member) { return member.uid !== server.createdByUserId; }).map(function (member, idx) { return (react_1["default"].createElement("div", { key: idx, className: "flex justify-between items-center" },
                            react_1["default"].createElement("p", { className: "text-[6px] sm:text-[7px] lg:text-[12px] xl:text-[16px] cursor-pointer hover:text-[#68A86B]" },
                                member.username,
                                "  - ",
                                member.jobRole,
                                " "),
                            react_1["default"].createElement(image_1["default"], { className: "object-contain w-[5px] sm:w-[8px] lg:w-[12px] xl:w-[16px] cursor-pointer", src: remove_user_jpg_1["default"], alt: "remove user", onClick: function () { return handleRemoveUserClick(member); } }))); }))),
                    removePopupOpen && (react_1["default"].createElement("div", { className: "fixed inset-[-60px] bg-gray-800 bg-opacity-10 flex justify-center items-center z-10 text-black" },
                        react_1["default"].createElement("div", { className: "relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl" },
                            react_1["default"].createElement("h1", { className: "text-center font-bold" }, removeMsgText),
                            react_1["default"].createElement("div", { className: "mt-5 flex justify-center gap-x-6" },
                                react_1["default"].createElement("button", { className: " text-white py-1 px-5 rounded-md hover:bg-red-600 bg-[#D26767] font-semibold transition duration-300", onClick: handleConfirmRemoveUser }, "Confirm"),
                                react_1["default"].createElement("button", { className: " text-white bg-[#68A86B] hover:bg-gray-600 py-1 px-5 rounded-md font-semibold $transition duration-300", onClick: function () { return setRemovePopupOpen(false); } }, "Cancel"))))),
                    exitPopupOpen && (react_1["default"].createElement("div", { className: "fixed inset-[-60px] bg-gray-800 bg-opacity-10 flex justify-center items-center z-10 text-black" },
                        react_1["default"].createElement("div", { className: "relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl" },
                            react_1["default"].createElement("p", { className: "text-sm text-gray-600 mt-2" },
                                "Are you sure you want to leave ",
                                react_1["default"].createElement("strong", null, server.serverName),
                                "? You won\u2019t be able to access this server anymore."),
                            react_1["default"].createElement("div", { className: "mt-5 flex justify-center gap-x-6" },
                                react_1["default"].createElement("button", { className: " text-white bg-[#68A86B] hover:bg-gray-600 py-1 px-5 rounded-md font-semibold $transition duration-300", onClick: function () { return handleExitServer(server.serverId); } }, "Exit Server"),
                                react_1["default"].createElement("button", { className: " text-white py-1 px-5 rounded-md hover:bg-red-600 bg-[#D26767] font-semibold transition duration-300", onClick: function () { return setExitPopupOpen(false); } }, "Cancel")))))));
            })))) : (react_1["default"].createElement("div", null,
            react_1["default"].createElement("div", { className: "text-[8px] flex items-center justify-center font-bold lg:px-4 lg:py-1 text-black block sm:hidden" },
                " ",
                "Select a server"),
            react_1["default"].createElement("div", { className: "text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px] flex items-center text-center justify-center font-bold lg:px-4 lg:py-1 text-black hidden sm:block" },
                " ",
                "Create or Select a server")))));
};
exports["default"] = TaskSection;
