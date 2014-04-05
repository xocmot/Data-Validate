/*!
 * data-Validate JavaScript Library v1.0.0
 * http://data-validate.com
 *
 * Copyright 2008, 2014 Data-Validate Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://data-validate.com/license.html
 *
 * Date: 2014-01-03
 */

var allowableSpecialChars = "\!\@\#\$\^\&\_";
var domcount = 0;
var children = new Array();
var processed = new Array();
var originNodeId = "-1";

//error DIV Configurations
var desiredMode = "right";
var desiredModeAvailable = false;
var errorDivWidth = 150;
var errorDivHeight = 20;
var additionalOffset = 10;
var backgroundColor = '#b0c4de';
var border = "1px solid black";
var position = "absolute";

//ELEMENTS
function dataValidateAddEvents() {
    domcount = 0;
    var elements = document.getElementsByTagName('*');
    for (var e = 0; e < elements.length; e++) {
        var element = elements[e];
        if (typeof (element) == 'undefined' || element == null) { /* this element isn't an input element. */
        } else {
            switch (element.tagName.toUpperCase()) {
                case "BASE":
                case "HEAD":
                case "HTML":
                case "META":
                case "PARAM":
                case "SCRIPT":
                case "STYLE":
                case "TITLE":
                    //do nothing, HTML 4.01 is not compatible with adding ID attributes to these tags
                    break;
                default:
                    //these tags are HTML 4.01 and HTML 5.0 compliant
                    //add an id to the element so I can differentiate between elements in the tree scan.
                    //if (element.id != null) {
                    //    if (element.id == '') {
                    //        element.id = 'av' + e.toString();
                    //    }
                    //}
                    
                    domcount = domcount + 1;
                    var id = element.getAttribute("id");
                    if (id == null || id == "" || id == "undefined") {
                        element.setAttribute("id", "data-v-" + domcount);
                    }
                    
                    var func;
                    switch (element.tagName.toUpperCase()) {
                        case "BODY":
                            window.onresize = function (event) {
                                var forms = document.getElementsByTagName('form');
                                for (var f = 0; f < forms.length; f++) {
                                    var form = forms[f];
                                    if (!VF(form, false)) {
                                        //validation requirements were found
                                    }
                                }
                            };
                            break;
                        case "FORM":
                            if (element.onsubmit == null) {
                                element.setAttribute("onsubmit", "return VF(this, false)");
                            } else {
                                if (typeof element.onsubmit.toString().indexOf("function") > -1) {
                                    func = element.onsubmit.toString().substring(element.onsubmit.toString().indexOf("{") + 2, element.onsubmit.toString().indexOf("}") - 1);
                                    element.setAttribute("onsubmit", "var vf = VF(this, false); if (vf) " + func + "; return vf;");
                                }
                            }
                            break;
                        case "INPUT":
                            switch (element.type.toLowerCase()) {
                                case "button":
                                case "radio":
                                case "range":
                                case "reset":
                                case "search":
                                case "tel":
                                case "time":
                                case "url":
                                case "week":
                                case "checkbox":
                                case "color":
                                case "date":
                                case "datetime":
                                case "datetime-local":
                                case "email":
                                case "file":
                                case "hidden":
                                case "image":
                                case "month":
                                case "number":
                                case "submit":
                                    break;
                                case "password":
                                case "text":
                                    if (element.onkeyup == null) {
                                        element.setAttribute("onkeyup", "return VF(this, true)");
                                    } else {
                                        if (typeof element.onkeyup.toString().indexOf("function") > -1) {
                                            func = element.onkeyup.toString().substring(element.onkeyup.toString().indexOf("{") + 2, element.onkeyup.toString().indexOf("}") - 1);
                                            element.setAttribute("onkeyup", "var vf = VF(this, true); if (vf) " + func + "; return vf;");
                                        }
                                    }
                                    //Later Implementation, Conflicts with OnkeyUp
                                    //if (element.onkeydown == null) {
                                    //    element.setAttribute("onkeydown", "return VF(this, true)");
                                    //} else {
                                    //    if (typeof element.onkeydown.toString().indexOf("function") > -1) {
                                    //        func = element.onkeydown.toString().substring(element.onkeydown.toString().indexOf("{") + 2, element.onkeydown.toString().indexOf("}") - 1);
                                    //        element.setAttribute("onkeydown", "var vf = VF(this, true); if (vf) " + func + "; return vf;");
                                    //    }
                                    //}
                                    //if (element.onkeypress == null) {
                                    //    element.setAttribute("onkeypress", "return VF(this, true)");
                                    //} else {
                                    //    if (typeof element.onkeypress.toString().indexOf("function") > -1) {
                                    //        func = element.onkeypress.toString().substring(element.onkeypress.toString().indexOf("{") + 2, element.onkeypress.toString().indexOf("}") - 1);
                                    //        element.setAttribute("onkeypress", "var vf = VF(this, true); if (vf) " + func + "; return vf;");
                                    //    }
                                    //}
                                    if (element.onfocus == null) {
                                        element.setAttribute("onfocus", "return VF(this, true)");
                                    } else {
                                        if (typeof element.onfocus.toString().indexOf("function") > -1) {
                                            func = element.onfocus.toString().substring(element.onfocus.toString().indexOf("{") + 2, element.onfocus.toString().indexOf("}") - 1);
                                            element.setAttribute("onfocus", "var vf = VF(this, true); if (vf) " + func + "; return vf;");
                                        }
                                    }
                                    if (element.onblur == null) {
                                        element.setAttribute("onblur", "removeAllErrorMessages()");
                                    } else {
                                        if (typeof element.onblur.toString().indexOf("function") > -1) {
                                            func = element.onblur.toString().substring(element.onblur.toString().indexOf("{") + 2, element.onblur.toString().indexOf("}") - 1);
                                            element.setAttribute("onblur", "removeAllErrorMessages();" + func + ";");
                                        }
                                    }
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "TEXTAREA":
                            if (element.onkeyup == null) {
                                element.setAttribute("onkeyup", "return VF(this, true)");
                            } else {
                                if (typeof element.onkeyup.toString().indexOf("function") > -1) {
                                    func = element.onkeyup.toString().substring(element.onkeyup.toString().indexOf("{") + 2, element.onkeyup.toString().indexOf("}") - 1);
                                    element.setAttribute("onkeyup", "var vf = VF(this, true); if (vf) " + func + "; return vf;");
                                }
                            }
                            //Later Implementation, Conflicts with OnkeyUp
                            //if (element.onkeydown == null) {
                            //    element.setAttribute("onkeydown", "return VF(this, true)");
                            //} else {
                            //    if (typeof element.onkeydown.toString().indexOf("function") > -1) {
                            //        func = element.onkeydown.toString().substring(element.onkeydown.toString().indexOf("{") + 2, element.onkeydown.toString().indexOf("}") - 1);
                            //        element.setAttribute("onkeydown", "var vf = VF(this, true); if (vf) " + func + "; return vf;");
                            //    }
                            //}
                            //if (element.onkeypress == null) {
                            //    element.setAttribute("onkeypress", "return VF(this, true)");
                            //} else {
                            //    if (typeof element.onkeypress.toString().indexOf("function") > -1) {
                            //        func = element.onkeypress.toString().substring(element.onkeypress.toString().indexOf("{") + 2, element.onkeypress.toString().indexOf("}") - 1);
                            //        element.setAttribute("onkeypress", "var vf = VF(this, true); if (vf) " + func + "; return vf;");
                            //    }
                            //}
                            if (element.onfocus == null) {
                                element.setAttribute("onfocus", "return VF(this, true)");
                            } else {
                                if (typeof element.onfocus.toString().indexOf("function") > -1) {
                                    func = element.onfocus.toString().substring(element.onfocus.toString().indexOf("{") + 2, element.onfocus.toString().indexOf("}") - 1);
                                    element.setAttribute("onfocus", "var vf = VF(this, true); if (vf) " + func + "; return vf;");
                                }
                            }
                            if (element.onblur == null) {
                                element.setAttribute("onblur", "removeAllErrorMessages()");
                            } else {
                                if (typeof element.onblur.toString().indexOf("function") > -1) {
                                    func = element.onblur.toString().substring(element.onblur.toString().indexOf("{") + 2, element.onblur.toString().indexOf("}") - 1);
                                    element.setAttribute("onblur", "removeAllErrorMessages();" + func + ";");
                                }
                            }
                            break;
                        case "LABEL":
                        case "FIELDSET":
                        case "LEGEND":
                        case "SELECT":
                        case "OPTGROUP":
                        case "OPTION":
                        case "BUTTON":
                        case "DATALIST":
                        case "KEYGEN":
                        case "OUTPUT":
                            break;
                    }
                    break;
            }
        }
    }
}

//ELEMENTS
function dataValidateAddEventsJQ() {
    domcount = 0;
    var elements = document.getElementsByTagName('*');
    for (var e = 0; e < elements.length; e++) {
        var element = elements[e];
        if (typeof (element) == 'undefined' || element == null) { /* this element isn't an input element. */
        } else {
            switch (element.tagName.toUpperCase()) {
                case "BASE":
                case "HEAD":
                case "HTML":
                case "META":
                case "PARAM":
                case "SCRIPT":
                case "STYLE":
                case "TITLE":
                    //do nothing, HTML 4.01 is not compatible with adding ID attributes to these tags
                    break;
                default:
                    //these tags are HTML 4.01 and HTML 5.0 compliant
                    //add an id to the element so I can differentiate between elements in the tree scan.
                    //if (element.id != null) {
                    //    if (element.id == '') {
                    //        element.id = 'av' + e.toString();
                    //    }
                    //}

                    domcount = domcount + 1;
                    var id = element.getAttribute("id");
                    if (id == null || id == "" || id == "undefined") {
                        element.setAttribute("id", "data-v-" + domcount);
                    }
                    var func;
                    switch (element.tagName.toUpperCase()) {
                        case "BODY":
                            window.onresize = function (event) {
                                var forms = document.getElementsByTagName('form');
                                for (var f = 0; f < forms.length; f++) {
                                    var form = forms[f];
                                    if (!VF(form, false)) {
                                        //validation requirements were found
                                    }
                                }
                            };
                            break;
                        case "FORM":
                            $("#" + element.id).submit(
                                function (event) {
                                    if (!VF(this, false)) {
                                        event.stopImmediatePropagation();
                                        event.preventDefault();
                                    }
                                }
                            );
                            break;
                        case "INPUT":
                            switch (element.type.toLowerCase()) {
                                case "button":
                                case "checkbox":
                                case "color":
                                case "date":
                                case "datetime":
                                case "datetime-local":
                                case "email":
                                case "file":
                                case "hidden":
                                case "image":
                                case "month":
                                case "number":
                                case "radio":
                                case "range":
                                case "reset":
                                case "search":
                                case "submit":
                                case "tel":
                                case "time":
                                case "url":
                                case "week":
                                    break;
                                case "password":
                                case "text":
                                    $("#" + element.id).keyup(
                                        function (event) {
                                            if (!VF(this, true)) {
                                                event.stopImmediatePropagation();
                                            }
                                        }
                                    );
                                    $("#" + element.id).keydown(
                                        function (event) {
                                            if (!VF(this, true)) {
                                                event.stopImmediatePropagation();
                                            }
                                        }
                                    );
                                    $("#" + element.id).keypress(
                                        function (event) {
                                            if (!VF(this, true)) {
                                                event.stopImmediatePropagation();
                                            }
                                        }
                                    );
                                    $("#" + element.id).focus(
                                        function (event) {
                                            if (!VF(this, true)) {
                                                event.stopImmediatePropagation();
                                            }
                                        }
                                    );
                                    $("#" + element.id).blur(
                                        function () {
                                            removeAllErrorMessages();
                                        }
                                    );
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "TEXTAREA":
                            $("#" + element.id).keyup(
                                function (event) {
                                    if (!VF(this, true)) {
                                        event.stopImmediatePropagation();
                                    }
                                }
                            );
                            $("#" + element.id).keydown(
                               function (event) {
                                   if (!VF(this, true)) {
                                       event.stopImmediatePropagation();
                                   }
                               }
                           );
                            $("#" + element.id).keypress(
                               function (event) {
                                   if (!VF(this, true)) {
                                       event.stopImmediatePropagation();
                                   }
                               }
                           );
                            $("#" + element.id).focus(
                                function (event) {
                                    if (!VF(this, true)) {
                                        event.stopImmediatePropagation();
                                    }
                                }
                            );
                            $("#" + element.id).blur(
                                function () {
                                    removeAllErrorMessages();
                                }
                            );
                            break;
                        case "LABEL":
                        case "FIELDSET":
                        case "LEGEND":
                        case "SELECT":
                        case "OPTGROUP":
                        case "OPTION":
                        case "BUTTON":
                        case "DATALIST":
                        case "KEYGEN":
                        case "OUTPUT":
                            break;
                    }
                    break;
            }
        }
    }
}

//VALIDATE FORM,ELEMENT
function VF(e, validateSingle) {
    if (validateSingle == true) {
        return ValidateElement(e, validateSingle);
    } else {
        var elementHasError = false;
        var elementErrorCount = 0;

        var form = null;
        if (e.tagName.toUpperCase() == "FORM") {
            form = e;
        } else if (e.parentNode != null) {
            if (e.parentNode.tagName.toUpperCase() == "FORM") {
                form = e.parentNode;
            }
        }

        if (form != null) {
            children = new Array();
            processed = new Array();
            domcount = 0;

            var id = form.getAttribute("id");
            if (id == null || id == "" || id == "undefined") {
                form.setAttribute("id", "data-v-" + domcount);
            }
            id = form.getAttribute("id");
            originNodeId = id;
            getAllChildNodesForNode(id);
            for (var n = 0; n < children.length; n++) {
                var node = document.getElementById(children[n]);
                if (nodeIsApprovedType(node)) {
                    elementHasError = ValidateElement(node, validateSingle);
                    if (elementHasError) {
                        elementErrorCount = elementErrorCount + 1;
                    }
                }
            }
            children = new Array();
        } else {
            return false;
        }

        if ((elementErrorCount > 0) || ((elementErrorCount == 0) && (elementHasError))) {
            return false;
        } else {
            return true;
        }
    }
}

function getAllChildNodesForNode(nodeId) {
    children = crawlNodeLineage(nodeId, "down");
    processed = new Array();
}

function crawlNodeLineage(nodeId, direction) {

    var node = document.getElementById(nodeId);
    if (node != null) {

        domcount = domcount + 1;
        var id = node.getAttribute("id");
        if (id == null || id == "" || id == "undefined") {
            node.setAttribute("id", "data-v-" + domcount);
            id = node.getAttribute("id");
        }

        if (!arrayContainsObject(id)) {
            processed[processed.length] = id;
        }

        if (direction != "up" && node.tagName != null && node.tagName != "undefined") {
            //NOTE -- SUBMIT is skipped because I didn't think I would be validating the element, and all submissions would be occouring from the text
            switch (node.tagName.toUpperCase()) {
                case "INPUT":
                    switch (node.type.toLowerCase()) {
                        case "checkbox":
                        case "file":
                        case "password":
                        case "radio":
                        case "text":
                            if (node.name != "") {
                                children[children.length] = nodeId;
                            }
                            break;
                        case "color":
                        case "date":
                        case "datetime":
                        case "datetime-local":
                        case "email":
                        case "hidden":
                        case "image":
                        case "month":
                        case "number":
                        case "button":
                        case "time":
                        case "url":
                        case "week":
                        case "range":
                        case "reset":
                        case "search":
                        case "submit":
                        case "tel":
                        default:
                            break;
                    }
                    break;
                case "TEXTAREA":
                    if (node.name != "") {
                        children[children.length] = nodeId;
                    }
                    break;
                case "LABEL":
                case "FIELDSET":
                case "LEGEND":
                case "SELECT":
                case "OPTGROUP":
                case "OPTION":
                case "BUTTON":
                case "DATALIST":
                case "KEYGEN":
                case "OUTPUT":
                    break;
            }
        }

        //if node has valid unprocessed children
        var childNodeId = getFirstUsableChildNode(nodeId);
        if (childNodeId != "-1") {
            direction = "down";
            return crawlNodeLineage(childNodeId, direction);
        }
        else {
            var siblingNodeId = getFirstUsableSiblingNode(nodeId);
            //if node has valid unprocessed siblings
            if (siblingNodeId != "-1") {
                direction = "sideways";
                return crawlNodeLineage(siblingNodeId, direction);
            }
            else {
                //if node has parent != originnode
                if (node.parentNode.id != originNodeId) {
                    direction = "up";
                    return crawlNodeLineage(node.parentNode.id, direction);
                }
                else {
                    //all nodes below the origin have been crawled, return to origin
                    return children;
                }
            }
        }
    }
    return children;
}

function getFirstUsableChildNode(nodeId) {

    var node = document.getElementById(nodeId);
    for (var n = 0; n < node.children.length; n++) {
        var child = node.children[n];
        if (child != null && !arrayContainsObject(child.id)) {
            var id = child.getAttribute("id");
            if (id == null || id == "" || id == "undefined") {
                child.setAttribute("id", "data-v-" + domcount);
            }
            return child.id;
        }
        child = null;
    }
    return "-1";
}

function getFirstUsableSiblingNode(nodeId) {

    var node = document.getElementById(nodeId);
    for (var n = 0; n < node.parentNode.children.length; n++) {
        var sibling = node.parentNode.children[n];
        if (sibling != null && sibling.id != nodeId && !arrayContainsObject(sibling.id)) {
            var id = sibling.getAttribute("id");
            if (id == null || id == "" || id == "undefined") {
                sibling.setAttribute("id", "data-v-" + domcount);
            }
            return sibling.id;
        }
        sibling = null;
    }
    return "-1";
}

function arrayContainsObject(objectTarget) {
    for (var i = 0; i < processed.length; i++) {
        if (processed[i] == objectTarget) {
            return true;
        }
    }
    return false;
}

function nodeIsApprovedType(node) {
    switch (node.tagName.toUpperCase()) {
        case "INPUT":
            switch (node.type.toLowerCase()) {
                case "checkbox":
                case "file":
                case "password":
                case "radio":
                case "text":
                    if (node.name != "") {
                        return true;
                    }
                    break;
                case "color":
                case "date":
                case "datetime":
                case "datetime-local":
                case "email":
                case "hidden":
                case "image":
                case "month":
                case "number":
                case "button":
                case "time":
                case "url":
                case "week":
                case "range":
                case "reset":
                case "search":
                case "submit":
                case "tel":
                default:
                    break;
            }
            break;
        case "TEXTAREA":
            if (node.name != "") {
                return true;
            }
            break;
        case "LABEL":
        case "FIELDSET":
        case "LEGEND":
        case "SELECT":
        case "OPTGROUP":
        case "OPTION":
        case "BUTTON":
        case "DATALIST":
        case "KEYGEN":
        case "OUTPUT":
            break;
    }
    return false;
}

function ValidateElement(element, validateSingle) {
    var returnValue = false;
    var errorCount = 0;

    if (element != null) {
        var elementTagName = element.tagName.toUpperCase();
        if (elementTagName == "INPUT") {
            var elementValue = getElementValue(element);
            var elementCharCount = "[(" + elementValue.length.toString() + ") chars] ";
            for (var a = 0; a < element.attributes.length; a++) {
                var attribute = element.attributes[a];
                if (attribute != null) {
                    if (attribute.value != null) {
                        if (attribute.name.indexOf('data-v-') != -1) {
                            var validationPartArray = attribute.name.split('-');
                            if (validationPartArray.length > 2) {
                                var validationTypeName = validationPartArray[2].toLowerCase();
                                var validationTypeValues = attribute.value.replace(/ /gi, "").split(",");
                                errorRemoveFromNode(element, validationTypeName);
                                var max;
                                var min;

                                switch (validationTypeName) {
                                    case "email":
                                        //usage: data-v-email=""
                                        if (IsEmail(elementValue)) {
                                            returnValue = true;
                                            errorRemoveFromNode(element, validationTypeName);
                                        } else {
                                            errorCount = errorCount + 1;
                                            errorAddToNode(element, "please enter a valid email address", validationTypeName);
                                        }
                                        break;
                                    case "creditcard":
                                        //usage: data-v-creditcard=""
                                        if (IsValidCreditCard(elementValue)) {
                                            returnValue = true;
                                            errorRemoveFromNode(element, validationTypeName);
                                        } else {
                                            errorCount = errorCount + 1;
                                            errorAddToNode(element, "please enter a valid credit card", validationTypeName);
                                        }
                                        break;
                                    case "password":
                                        //Validate Password:    
                                        //Must be between 8 and 21 characters    
                                        //Must have at least 1 number    
                                        //Must have at least 1 special character    
                                        //Must have at least 1 capital letter    
                                        //usage: data-v-password=""
                                        min = 8;
                                        max = 21;

                                        if (IsLengthInRange(element, 8, 21)) {
                                            if (GetNumericCharacterCount(elementValue) >= 1) {
                                                if (GetSpecialCharacterCount(elementValue) >= 1) {
                                                    if (GetAlphaCapitalsCount(elementValue) >= 1) {
                                                        returnValue = true;
                                                        errorRemoveFromNode(element, validationTypeName);
                                                    }
                                                    else {

                                                        errorCount = errorCount + 1;
                                                        errorAddToNode(element, "password must contain a capital letter", validationTypeName);
                                                    }
                                                }
                                                else {
                                                    errorCount = errorCount + 1;
                                                    errorAddToNode(element, "password must contain a special character like " + allowableSpecialChars.replace(/\\/gi, ""), validationTypeName);
                                                }
                                            }
                                            else {
                                                errorCount = errorCount + 1;
                                                errorAddToNode(element, "password must contain a number", validationTypeName);
                                            }
                                        } else {
                                            errorCount = errorCount + 1;
                                            errorAddToNode(element, elementCharCount + "please type between " + min.toString() + " and " + max.toString() + " characters", validationTypeName);
                                        }
                                        break;
                                    case "compare":
                                        //Validate Two Compared Elements:    
                                        //usage: data-v-compare="[Target Element HTML Name],[Source Element Error Title],[Target Element Error Title]" 
                                        //Source Title: Password 1    
                                        //Target Title: Password 2    
                                        //usage: data-v-compare="password2,Password 1, Password 2"
                                        var validationTypeValuesC = attribute.value.split(",");
                                        if (elementsAreEqual(element, validationTypeValuesC[0])) {
                                            returnValue = true;
                                            errorRemoveFromNode(element, validationTypeName);
                                        } else {
                                            errorCount = errorCount + 1;
                                            errorAddToNode(element, validationTypeValuesC[1].toLowerCase() + " and " + validationTypeValuesC[2].toLowerCase() + " don't match", validationTypeName);
                                        }
                                        break;
                                    case "required":
                                        //Validate Required Field:    
                                        //If this is an element with multiple nodes, rules are applied based off options.    
                                        //  RADIO
                                        //      If data-validate-required attribute is set to "true", will check for a selected node and error if none selected.    
                                        //      If data-validate-required attribute is set to "", will check for a selected node and error if none selected.    
                                        //  CHECKBOX
                                        //      If data-v-required attribute is set to "true", will check for a selected node, 
                                        // and in addition will only allow one checkbox to be checked. If these rules are not met, an error is thrown.    
                                        //      If data-v-required attribute is set to "", will check for a selected node, and will allow multiple checked checkboxes.    
                                        //  TEXTBOX, OTHER FIELD TYPES   
                                        //      Checks for a minimum of 1 character in the value, and if no value exists, throws an error
                                        //usage: data-v-required="" or data-v-required="true"
                                        var groupOneCheckOnly = false;
                                        var groupOneCheckOnlyValue = validationTypeValues[0];
                                        var elementHasErrors = elementHasError(element, validationTypeName);
                                        if (groupOneCheckOnlyValue == "true") { groupOneCheckOnly = true; }

                                        if (element.type == "radio" || element.type == "checkbox") {
                                            var groupCheckedCounts = groupCheckedCount(element);
                                            if ((groupOneCheckOnly && groupCheckedCounts == 1) || (!groupOneCheckOnly && groupCheckedCounts >= 1)) {
                                                errorRemoveFromGroup(element, validationTypeName);
                                                returnValue = true;
                                            } else if (groupCheckedCounts == 0) {
                                                if (elementHasErrors) {
                                                    errorRemoveFromGroup(element, validationTypeName);
                                                }
                                                errorAddBeforeFirstNodeInGroup(element, "required field", validationTypeName);
                                                errorCount = errorCount + 1;
                                            } else if (groupOneCheckOnly && groupCheckedCounts > 1) {
                                                if (elementHasErrors) {
                                                    errorRemoveFromGroup(element, validationTypeName);
                                                }
                                                errorAddBeforeFirstNodeInGroup(element, "select only one", validationTypeName);
                                                errorCount = errorCount + 1;
                                            }
                                        }
                                        else {
                                            if (elementValue.length > 0) {
                                                returnValue = true;
                                                errorRemoveFromNode(element, validationTypeName);
                                            } else {
                                                errorCount = errorCount + 1;
                                                errorAddToNode(element, "required field", validationTypeName);
                                            }
                                        }
                                        break;
                                    case "min":
                                        //usage: data-v-min="[minimum # characters]"
                                        min = validationTypeValues[0];
                                        if (IsLengthInRange(element, min, 1024)) {
                                            returnValue = true;
                                            errorRemoveFromNode(element, validationTypeName);
                                        } else {
                                            errorCount = errorCount + 1;
                                            errorAddToNode(element, elementCharCount + "please type a minimum of " + min.toString() + " characters", validationTypeName);
                                        }
                                        break;
                                    case "max":
                                        //usage: data-v-max="[maximum # characters]"
                                        max = validationTypeValues[0];
                                        if (IsLengthInRange(element, 0, max)) {
                                            returnValue = true;
                                            errorRemoveFromNode(element, validationTypeName);
                                        } else {
                                            errorCount = errorCount + 1;
                                            errorAddToNode(element, elementCharCount + "please type no more than " + max.toString() + " characters", validationTypeName);
                                        }
                                        break;
                                    case "range":
                                        //usage: data-v-range="[minimum characters], [maximum characters]"
                                        min = validationTypeValues[0];
                                        max = validationTypeValues[1];
                                        if (IsLengthInRange(element, min, max)) {
                                            returnValue = true;
                                            errorRemoveFromNode(element, validationTypeName);
                                        } else {
                                            errorCount = errorCount + 1;
                                            errorAddToNode(element, elementCharCount + "please type between " + min.toString() + " and " + max.toString() + " characters", validationTypeName);
                                        }
                                        break;
                                    case "a":
                                        //usage: data-v-a=""
                                        if (IsAlpha(elementValue)) {
                                            returnValue = true;
                                            errorRemoveFromNode(element, validationTypeName);
                                        } else {
                                            errorCount = errorCount + 1;
                                            errorAddToNode(element, "letters only", validationTypeName);
                                        }
                                        break;
                                    case "n":
                                        //usage: data-v-n=""
                                        if (IsNumeric(elementValue)) {
                                            returnValue = true;
                                            errorRemoveFromNode(element, validationTypeName);
                                        } else {
                                            errorCount = errorCount + 1;
                                            errorAddToNode(element, "numbers only", validationTypeName);
                                        }
                                        break;
                                    case "an":
                                        //usage: data-v-an=""
                                        if (IsAlphaNumeric(elementValue)) {
                                            returnValue = true;
                                            errorRemoveFromNode(element, validationTypeName);
                                        } else {
                                            errorCount = errorCount + 1;
                                            errorAddToNode(element, "letters and numbers only, no spaces", validationTypeName);
                                        }
                                        break;
                                    case "anws":
                                        //usage: data-v-anws=""
                                        if (IsAlphaNumericWithSpaces(elementValue)) {
                                            returnValue = true;
                                            errorRemoveFromNode(element, validationTypeName);
                                        } else {
                                            errorCount = errorCount + 1;
                                            errorAddToNode(element, "letters, numbers, and spaces only", validationTypeName);
                                        }
                                        break;
                                    case "anwsc":
                                        //usage: data-v-anwsc=""
                                        if (IsAlphaNumericWithSpecialCharacters(elementValue)) {
                                            returnValue = true;
                                            errorRemoveFromNode(element, validationTypeName);
                                        } else {
                                            errorCount = errorCount + 1;
                                            errorAddToNode(element, "no spaces allowed", validationTypeName);
                                        }
                                        break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return errorCount > 0;
}

function removeAllErrorMessages() {
    var elements = document.getElementsByClassName("AutoValidateErrors");
    for (var i = elements.length - 1; i >= 0; i--) {
        var element = elements[i];
        element.parentElement.removeChild(element);
    }
}

function returnHighestZIndex() {
    var currentZIndex = 0;
    var highestZIndex = 0;
    var previousZIndex = 0;
    var elements = document.getElementsByTagName('*');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element != null && element != 'undefined') {
            if (element.style.zIndex != "" && element.style.zIndex != null && element.style.zIndex != 'undefined') {
                if (!isNaN(parseInt(element.style.zIndex))) {
                    currentZIndex = parseInt(element.style.zIndex);
                    if (currentZIndex > previousZIndex) {
                        highestZIndex = currentZIndex;
                    }
                    previousZIndex = highestZIndex;
                }
            }
        }
    }

    return highestZIndex;
}

function errorRemoveFromNode(element, errorType) {
    if (element != null && errorType != null) {
        var targetElement = document.getElementById(element.name + "error" + errorType);
        if (targetElement != null) {
            try {
                element.parentNode.removeChild(targetElement);
            } catch (e) {
                //couldn't find the node...
            }
        }
    }
}

function errorRemoveFromGroup(element, errorType) {
    if (element != null) {
        var x = document.getElementsByTagName("div");
        for (var e = 0; e < x.length; e++) {
            var targetElement = x[e];
            if (targetElement.id == element.name + "error" + errorType) {
                try {
                    element.parentNode.removeChild(targetElement);
                } catch(e) {
                    //couldn't find the node...
                } 
                
            }
        }
    }
}

function elementHasError(element, errorType) {
    if (element != null) {

        var x = document.getElementsByTagName("div");
        for (var e = 0; e < x.length; e++) {
            var targetElement = x[e];
            if (targetElement.id == element.name + "error" + errorType) {
                return true;
            }
        }
    }
    return false;
}

function groupCheckedCount(element) {

    var elementCheckedCount = 0;

    if (element != null) {
        var x = document.getElementsByName(element.name);
        for (var e = 0; e < x.length; e++) {
            var targetElement = x[e];
            if (targetElement.checked) {
                elementCheckedCount = elementCheckedCount + 1;
            }
        }
    }

    return elementCheckedCount;
}

function elementsAreEqual(element, elementTargetName) {
    var x = document.getElementsByName(elementTargetName);
    for (var e = 0; e < x.length; e++) {
        var targetElement = x[e];
        if (targetElement != null && targetElement != "undefined") {
            if (element.value == targetElement.value && element.value != '') {
                return true;
            }
        }
    }
    return false;
}

function errorAddToNode(element, message, errorType) {
    if (element != null && message != null && errorType != null) {
        if (!document.getElementById(element.name + "error" + errorType) || document.getElementById(element.name + "error" + errorType) == 'undefined') {
            var newNode = document.createElement('div');
            newNode.setAttribute('id', element.name + "error" + errorType);
            newNode.setAttribute('class', 'AutoValidateErrors');
            newNode.style.zIndex = returnHighestZIndex() + 1;
            newNode.innerHTML = message;
            element.parentNode.insertBefore(positionErrorElement(element, newNode), element.nextSibling);
        }
    }
}

function errorAddToFirstNodeInGroup(element, message, errorType) {
    if (element != null && message != null && errorType != null) {
        if (!document.getElementById(element.name + "error" + errorType) || document.getElementById(element.name + "error" + errorType) == 'undefined') {
            var x = document.getElementsByName(element.name);
            var targetElement = x[0];
            var newNode = document.createElement('div');
            newNode.setAttribute('id', targetElement.name + "error" + errorType);
            newNode.setAttribute('class', 'AutoValidateErrors');
            newNode.style.zIndex = returnHighestZIndex() + 1;
            newNode.innerHTML = message;
            targetElement.parentNode.insertBefore(positionErrorElement(targetElement, newNode), targetElement.nextSibling);
        }
    }
}

function errorAddBeforeFirstNodeInGroup(element, message, errorType) {
    if (element != null && message != null && errorType != null) {
        if (!document.getElementById(element.name + "error" + errorType) || document.getElementById(element.name + "error" + errorType) == 'undefined') {
            var x = document.getElementsByName(element.name);
            var targetElement = x[0];
            var newNode = document.createElement('div');
            newNode.setAttribute('id', targetElement.name + "error" + errorType);
            newNode.setAttribute('class', 'AutoValidateErrors');
            newNode.style.zIndex = returnHighestZIndex() + 1;
            newNode.innerHTML = message;
            targetElement.parentNode.insertBefore(positionErrorElement(targetElement, newNode), targetElement);
        }
    }
}

function errorAddToLastNodeInGroup(element, message, errorType) {
    if (element != null && message != null && errorType != null) {
        if (!document.getElementById(element.name + "error" + errorType) || document.getElementById(element.name + "error" + errorType) == 'undefined') {
            var x = document.getElementsByName(element.name);
            var targetElement = x[x.length - 1];
            var newNode = document.createElement('div');
            newNode.setAttribute('id', targetElement.name + "error" + errorType);
            newNode.setAttribute('class', 'AutoValidateErrors');
            newNode.style.zIndex = returnHighestZIndex() + 1;
            newNode.innerHTML = message;
            targetElement.parentNode.insertBefore(positionErrorElement(targetElement, newNode), targetElement.nextSibling);
        }
    }
}

/////////

function positionErrorElement(origin, target) {

    var c = origin;
    var x = target;
    x.style.backgroundColor = backgroundColor;
    x.style.position = position;
    x.style.border = border;
    x.style.width = errorDivWidth.toString() + "px";
    
    var positions = findPosition(c);

    var leftModeAvailable = false;
    var topModeAvailable = false;
    var rightModeAvailable = false;
    var bottomModeAvailable = false;
    desiredModeAvailable = false;
    
    //LEFT SPACE ALLOWS ERROR DIV?
    if ((positions[0] - errorDivWidth) <= 0) { }
    else { leftModeAvailable = true; }

    //TOP SPACE ALLOWS ERROR DIV?
    if ((positions[1] - errorDivHeight || (window.innerWidth - (positions[0] + errorDivWidth)) <= 0) <= 0) { }
    else { topModeAvailable = true; }

    //RIGHT SPACE ALLOWS ERROR DIV?
    if (window.innerWidth - (positions[0] + c.offsetWidth + errorDivWidth + additionalOffset) <= 0 || window.innerHeight - (positions[1] + errorDivHeight) <= 0) { }
    else { rightModeAvailable = true; }

    //BOTTOM SPACE ALLOWS ERROR DIV?
    if (window.innerWidth - (positions[1] + c.offsetHeight + errorDivHeight + additionalOffset) <= 0 || (window.innerWidth - (positions[0] + errorDivWidth)) <= 0) { }
    else { bottomModeAvailable = true; }

    //can desired mode be used?
    switch (desiredMode) {
        case "left":
            if (leftModeAvailable) { desiredModeAvailable = true; }
            break;
        case "top":
            if (topModeAvailable) { desiredModeAvailable = true; }
            break;
        case "right":
            if (rightModeAvailable) { desiredModeAvailable = true; }
            break;
        case "bottom":
            if (bottomModeAvailable) { desiredModeAvailable = true; }
            break;
        default:
            break;
    }

    if (desiredModeAvailable) {
        switch (desiredMode) {
            case "left":
                positionLeft(x, c, additionalOffset, errorDivWidth, errorDivHeight);
                break;
            case "top":
                positionTop(x, c, additionalOffset, errorDivWidth, errorDivHeight);
                break;
            case "right":
                positionRight(x, c, additionalOffset, errorDivWidth, errorDivHeight);
                break;
            case "bottom":
                positionBottom(x, c, additionalOffset, errorDivWidth, errorDivHeight);
                break;
            default:
                break;
        }
    }
    else {
        var exit = false;
        for (var i = 1; i <= 4; i++) {
            switch (i) {
                case 1:
                    if (leftModeAvailable) {
                        positionLeft(x, c, additionalOffset, errorDivWidth, errorDivHeight);
                        exit = true;
                        break;
                    }
                case 2:
                    if (topModeAvailable) {
                        positionTop(x, c, additionalOffset, errorDivWidth, errorDivHeight);
                        exit = true;
                        break;
                    }
                case 3:
                    if (rightModeAvailable) {
                        positionRight(x, c, additionalOffset, errorDivWidth, errorDivHeight);
                        exit = true;
                        break;
                    }
                case 4:
                    if (bottomModeAvailable) {
                        positionBottom(x, c, additionalOffset, errorDivWidth, errorDivHeight);
                        exit = true;
                        break;
                    }
                default:
                    positionRight(x, c, additionalOffset, errorDivWidth, errorDivHeight);
                    break;
            }
            if (exit) {
                break;
            }
        }
    }

    return target;
}

function positionLeft(x, c, additionalOffset, errorDivWidth, errorDivHeight) {
    //LEFT OF PARENT ELEMENT
    x.style.left = (findPosition(c)[0] - errorDivWidth - additionalOffset).toString() + 'px';
    x.style.top = (findPosition(c)[1]).toString() + 'px';
}

function positionTop(x, c, additionalOffset, errorDivWidth, errorDivHeight) {
    //TOP OF PARENT ELEMENT
    x.style.left = (findPosition(c)[0]).toString() + 'px';
    x.style.top = (findPosition(c)[1] - errorDivHeight - additionalOffset).toString() + 'px';
}

function positionRight(x, c, additionalOffset, errorDivWidth, errorDivHeight) {
    //RIGHT OF PARENT ELEMENT
    x.style.left = (findPosition(c)[0] + c.offsetWidth + additionalOffset).toString() + 'px';
    x.style.top = (findPosition(c)[1]).toString() + 'px';
}

function positionBottom(x, c, additionalOffset, errorDivWidth, errorDivHeight) {
    //BOTTOM OF PARENT ELEMENT
    x.style.left = (findPosition(c)[0]).toString() + 'px';
    x.style.top = (findPosition(c)[1] + c.offsetHeight + additionalOffset).toString() + 'px';
}

function findPosition(obj) {
    var curleft = 0;
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        }
        while (obj = obj.offsetParent);
    }
    return [curleft, curtop];
}

/////////

function getElementValue(element) {
    if (element != null) {
        var elementTagName = element.tagName.toUpperCase();
        if (elementTagName == "INPUT") {
            return element.value;
        } else {
            return element.innerHTML;
        }
    } else {
        return "";
    }
}

function getArrayFromSplit(s, chr) {
    if (s != null) {
        return s.split(chr);
    } else {
        return s;
    }
}

function IsLengthInRange(element, min, max) {
    if (element != null) {
        var elementTagName = element.tagName.toUpperCase();
        var elementValue = "";
        if (elementTagName == "INPUT") {
            elementValue = element.value;
        } else {
            elementValue = element.innerHTML;
        }

        if (elementValue.length >= min && elementValue.length <= max) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function IsEmail(email) {
    if (email.length > 0) {
        var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (pattern.test(email)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function HasSpecialChars(value) {
    if (value != null) {
        var a = new RegExp("[" + allowableSpecialChars + "]+");
        return a.test(value);
    }
    return false;
}

function GetSpecialCharacterCount(value) {
    if (value != null) {
        var result = value.match("[" + allowableSpecialChars + "]+");
        if (result != null) {
            return result.length;
        }
    }
    return 0;
}

function GetAlphaCapitalsCount(value) {
    if (value != null) {
        var result = value.match("[A-Z]+");
        if (result != null) {
            return result.length;
        }
    }
    return 0;
}

function GetNumericCharacterCount(value) {
    if (value != null) {
        var result = value.match("[0-9]+");
        if (result != null) {
            return result.length;
        }
    }
    return 0;
}

function IsAlpha(value) {
    if (value != null) {
        var a = new RegExp("^[a-zA-Z]+$");
        return a.test(value);
    }
    return false;
}

function IsNumeric(value) {
    if (value != null) {
        var n = new RegExp("^[0-9]*\.?[0-9]+$");
        return n.test(value);
    }
    return false;
}

function IsAlphaNumeric(value) {
    if (value != null) {
        var an = new RegExp("^[a-zA-Z0-9]+$");
        return an.test(value);
    }
    return false;
}

function IsAlphaNumericWithSpaces(value) {
    if (value != null) {
        var anws = new RegExp("^[a-zA-Z0-9 ]+$");
        return anws.test(value);
    }
    return false;
}

function IsAlphaNumericWithSpecialCharacters(value) {
    if (value != null) {
        var anwsc = new RegExp("^[a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\-\_\+\=]+$");
        return anwsc.test(value);
    }
    return false;
}

function IsValidCreditCard(ccNumber) {

    var bResultOfParse = false;

    if (ccNumber.length > 0) {

        ccNumber = ccNumber.replace(/-/gi, "");
        var validNumbers = "0123456789";
        var ccNumberLen = ccNumber.length;
        var iCcn = parseInt(ccNumber);
        var sCcn = ccNumber.toString();
        sCcn = sCcn.replace(/^\s+|\s+$/g, '');
        var iTotal = 0;
        var isNumeric = true;
        var tempString;
        var calculation;

        for (var j = 0; j < ccNumberLen; j++) {
            tempString = "" + sCcn.substring(j, j + 1);
            if (validNumbers.indexOf(tempString) == "-1") {
                isNumeric = false;
            }
        }

        if ((ccNumberLen != 0) && (isNumeric)) {
            if (ccNumberLen >= 15) {
                for (var i = ccNumberLen; i > 0; i--) {
                    calculation = parseInt(iCcn) % 10;
                    calculation = parseInt(calculation);
                    iTotal += calculation;
                    i--;
                    iCcn = iCcn / 10;
                    calculation = parseInt(iCcn) % 10;
                    calculation = calculation * 2;
                    switch (calculation) {
                        case 10:
                            calculation = 1;
                            break;
                        case 12:
                            calculation = 3;
                            break;
                        case 14:
                            calculation = 5;
                            break;
                        case 16:
                            calculation = 7;
                            break;
                        case 18:
                            calculation = 9;
                            break;
                        default:
                            calculation = calculation;
                    }
                    iCcn = iCcn / 10;
                    iTotal += calculation;
                }
                if ((iTotal % 10) == 0) {
                    bResultOfParse = true;
                } else {
                    bResultOfParse = false;
                }
            }
        }
    }

    return bResultOfParse;
}
