"use strict";

describe("jlDirectives module", function() {
  beforeEach(module("jlDirectives", function($provide) {
    $provide.value('jlWindow', new test.mockWindow());
  }));

  describe("jlOffsetY directive", function() {
    var util, $timeout;

    beforeEach(inject(function(_$timeout_, _util_) {
      $timeout = _$timeout_;
      util = _util_;

      jasmine.clock().install();
    }));

    it("should position the element appropriately with type = inside", inject(function($compile, $rootScope) {
      var html =
        "<div id='wrap' style='height: 200; overflow-y: scroll'>" +
        "  <div style='height: 300px'></div>" +
        "  <div id='parent' style='height: 100px; overflow-y: scroll'>" +
        "    <div style='height: 500px'>" +
        "      <div id='target' jl-offset-y='{{ value }}' jl-offset-type=\"{{ 'inside' }}\" jl-offset-element=\"{{ '#parent' }}\" style='height: 10px'></div>" +
        "    </div>" +
        "  </div>" +
        "</div>";

      var scope = $rootScope.$new();
      scope.value = 325;

      var root = jQuery(html);
      root.appendTo(document.body);

      $compile(root)(scope);

      var wrap = root.find("#wrap");
      var parent = root.find("#parent");
      var target = root.find("#target");

      var baseTime = new Date(2013, 9, 23);
      jasmine.clock().mockDate(baseTime);

      expect(util.posWithinParent(target, parent).y).toEqual(325);
      scope.value = 412;
      scope.$digest();

      $timeout.flush(0);
      jasmine.clock().tick(0);

      expect(util.posWithinParent(target, parent).y).toEqual(412);
      wrap.scrollTop(30);
      wrap.triggerHandler("scroll");

      $timeout.flush(0);
      jasmine.clock().tick(0);

      parent.scrollTop(21);
      parent.triggerHandler("scroll");

      $timeout.flush(0);
      jasmine.clock().tick(0);

      expect(util.posWithinParent(target, parent).y).toEqual(412);

      document.body.removeChild(root.get(0));
    }));

    it("should position the element appropriately with type = relative", inject(function($compile, $rootScope) {
      var html =
        "<div id='wrap' style='height: 200; overflow-y: scroll'>" +
        "  <div style='height: 300px'></div>" +
        "  <div id='parent' style='height: 100px; overflow-y: scroll'>" +
        "    <div style='height: 500px'>" +
        "      <div id='target' jl-offset-y='{{ getValue() }}' jl-offset-type=\"{{ 'relative' }}\" jl-offset-element=\"{{ '#parent' }}\" style='height: 10px'></div>" +
        "    </div>" +
        "  </div>" +
        "</div>";

      var scope = $rootScope.$new();

      scope.value = 325;
      scope.getValue = function() { return scope.value; };

      var root = jQuery(html);
      root.appendTo(document.body);

      $compile(root)(scope);

      var wrap = root.find("#wrap");
      var parent = root.find("#parent");
      var target = root.find("#target");

      var baseTime = new Date(2013, 9, 23);
      jasmine.clock().mockDate(baseTime);

      expect(util.relativePos(target, parent).y).toEqual(325);
      scope.value = 412;
      scope.$digest();

      $timeout.flush(0);
      jasmine.clock().tick(0);

      expect(util.relativePos(target, parent).y).toEqual(412);
      wrap.scrollTop(30);
      wrap.triggerHandler("scroll");

      $timeout.flush(0);
      jasmine.clock().tick(0);

      parent.scrollTop(21);
      parent.triggerHandler("scroll");

      $timeout.flush(0);
      jasmine.clock().tick(0);

      expect(util.relativePos(target, parent).y).toEqual(412);

      document.body.removeChild(root.get(0));
    }));
  });
});
