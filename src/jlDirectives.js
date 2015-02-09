/**
* Generally useful directives
*
* @module App
* @submodule jlDirectives
* @requires jlUtil
* @requires jlScroll
*/
angular.module("jlDirectives", ["jlUtil", "jlScroll"])
  /**
  * (DIRECTIVE) Sets the vertical offset of an element
  *
  * @namespace jlDirectives
  * @class jlOffsetY
  * @constructor
  * @param {Angular service} $log
  * @param {Angular service} util
  * @param {Angular service} jlWindow
  * @param {Angular service} scroll
  */
  .directive("jlOffsetY", [
  "$log", "util", "jlWindow", "scroll",
  function($log, util, jlWindow, scroll) {

    function link($scope, $element, $attrs) {
      var element = util.element($element);
      var type = $attrs.jlOffsetType;
      var value = $attrs.jlOffsetY;
      var other = jlWindow;
      var offsetElementIsOutermostScrollArea = $attrs.jlOffsetElementIsOutermostScrollArea == "true";

      if (type != "relative" && type != "inside") {
        $log.error("Expected one of 'inside' or 'relative' in jlOffsetType. Defaulting to 'inside'");
        type = "inside";
      }

      if ($attrs.jlOffsetElement && $attrs.jlOffsetElement != "window") {
        var e = util.element($attrs.jlOffsetElement);

        if (e.length === 0) {
          $log.warn("No element matching selector '" + $attrs.jlOffsetElement + "'");
        }
        else {
          other = e;
        }
      }

      var update = function() {
        switch (type) {
          case "relative":
            util.setRelativeY(element, other, value);
            break;
          case "inside":
            util.setYWithinParent(element, other, value);
            break;
        }
      };

      $attrs.$observe('jlOffsetY', function(newValue) {
        value = newValue;
        update();
      });

      $attrs.$observe('jlOffsetType', function(newValue) {
        type = newValue;

        var x = element.css("left");
        switch (type) {
          case "relative":
            if (offsetElementIsOutermostScrollArea || $attrs.jlOffsetElement === "window") {
              element.css("position", "fixed");
            }
            break;
          case "inside":
            element.css("position", "absolute");
            break;
        }
        element.css("left", x);

        update();
      });

      update();

      scroll.addCallback(other, "jlOffsetY", update);

      $scope.$on("$destroy", function() {
        scroll.removeCallback(other, "jlOffsetY");
      });
    }

    return {
      restrict: "A",
      link: link
    };
  }]);
