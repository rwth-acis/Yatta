var YXml;

YXml = (function() {
  function YXml(tagname, attributes) {
    var a, a_name, c, c_name, _classes, _i, _len, _ref;
    if (attributes == null) {
      attributes = {};
    }
    this._xml = {};
    this._xml.tagname = tagname;
    if (attributes.constructor !== Object) {
      throw new Error("The attributes must be specified as a Object");
    }
    for (a_name in attributes) {
      a = attributes[a_name];
      if (a.constructor !== String) {
        throw new Error("The attributes must be of type String!");
      }
    }
    this._xml.attributes = attributes;
    this._xml.classes = {};
    _classes = this._xml.attributes["class"];
    delete this._xml.attributes["class"];
    if (_classes != null) {
      _ref = _classes.split(" ");
      for (c = _i = 0, _len = _ref.length; _i < _len; c = ++_i) {
        c_name = _ref[c];
        if (c.length > 0) {
          this._xml.classes[c_name] = c;
        }
      }
    }
    void 0;
  }

  YXml.prototype._name = "Xml";

  YXml.prototype._getModel = function(Y, ops) {
    if (this._model == null) {
      this._model = new ops.MapManager(this).execute();
      this._model.val("attributes", new Y.Object(this._xml.attributes));
      this._model.val("classes", new Y.Object(this._xml.classes));
      this._model.val("tagname", this._xml.tagname);
      this._model.val("children", new Y.List());
    }
    delete this._xml;
    return this._model;
  };

  YXml.prototype._setModel = function(_at__model) {
    this._model = _at__model;
    return delete this._xml;
  };

  YXml.prototype._setParent = function(parent) {
    if (parent instanceof YXml) {
      this.remove();
      return this._model.val("parent", parent);
    } else {
      throw new Error("parent must be of type Y.Xml!");
    }
  };

  YXml.prototype.toString = function() {
    var child, name, value, xml, _i, _len, _ref, _ref1;
    xml = "<" + this._model.val("tagname");
    _ref = this.attr();
    for (name in _ref) {
      value = _ref[name];
      xml += " " + name + '="' + value + '"';
    }
    xml += ">";
    _ref1 = this._model.val("children").val();
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      child = _ref1[_i];
      xml += child.toString();
    }
    xml += '</' + this._model.val("tagname") + '>';
    return xml;
  };

  YXml.prototype.attr = function(name, value) {
    var attrs, classes;
    if (arguments.length > 1) {
      if (value.constructor !== String) {
        throw new Error("The attributes must be of type String!");
      }
      this._model.val("attributes").val(name, value);
      return this;
    } else if (arguments.length > 0) {
      if (name === "class") {
        return Object.keys(this._model.val("classes").val()).join(" ");
      } else {
        return this._model.val("attributes").val(name);
      }
    } else {
      attrs = this._model.val("attributes").val();
      classes = Object.keys(this._model.val("classes").val()).join(" ");
      if (classes.length > 0) {
        attrs["class"] = classes;
      }
      return attrs;
    }
  };

  YXml.prototype.addClass = function(names) {
    var name, _i, _len, _ref;
    _ref = names.split(" ");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      this._model.val("classes").val(name, true);
    }
    return this;
  };

  YXml.prototype.after = function() {
    var c, content, contents, parent, position, _i, _j, _len, _len1, _ref;
    parent = this._model.val("parent");
    if (parent == null) {
      throw new Error("This Xml Element must not have siblings! (for it does not have a parent)");
    }
    _ref = parent.val("children").val();
    for (position = _i = 0, _len = _ref.length; _i < _len; position = ++_i) {
      c = _ref[position];
      if (c === this) {
        break;
      }
    }
    contents = [];
    for (_j = 0, _len1 = arguments.length; _j < _len1; _j++) {
      content = arguments[_j];
      if (!(content instanceof YXml || content.constructor === String)) {
        throw new Error("Y.Xml.after expects instances of YXml or String as a parameter");
      }
      contents.push(content);
    }
    return parent._model.val("children").insert(position + 1, contents);
  };

  YXml.prototype.append = function() {
    var content, contents, _i, _len;
    contents = [];
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      content = arguments[_i];
      if (!(content instanceof YXml || content.constructor === String)) {
        throw new Error("Y.Xml.after expects instances of YXml or String as a parameter");
      }
      contents.push(content);
    }
    return this._model.val("children").push(contents);
  };

  YXml.prototype.before = function() {
    var c, content, contents, parent, position, _i, _j, _len, _len1, _ref;
    parent = this._model.val("parent");
    if (parent == null) {
      throw new Error("This Xml Element must not have siblings! (for it does not have a parent)");
    }
    _ref = parent.val("children").val();
    for (position = _i = 0, _len = _ref.length; _i < _len; position = ++_i) {
      c = _ref[position];
      if (c === this) {
        break;
      }
    }
    contents = [];
    for (_j = 0, _len1 = arguments.length; _j < _len1; _j++) {
      content = arguments[_j];
      if (!(content instanceof YXml || content.constructor === String)) {
        throw new Error("Y.Xml.after expects instances of YXml or String as a parameter");
      }
      contents.push(content);
    }
    return parent._model.val("children").insert(position, contents);
  };

  YXml.prototype.empty = function() {
    var child, _i, _len, _ref, _results;
    _ref = this._model.val("children").val();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      _results.push(child.remove());
    }
    return _results;
  };

  YXml.prototype.hasClass = function(className) {
    if (this._model.val("classes").val(className) != null) {
      return true;
    } else {
      return false;
    }
  };

  YXml.prototype.prepend = function() {
    var content, contents, _i, _len;
    contents = [];
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      content = arguments[_i];
      if (!(content instanceof YXml || content.constructor === String)) {
        throw new Error("Y.Xml.after expects instances of YXml or String as a parameter");
      }
      contents.push(content);
    }
    return this._model.val("children").insert(0, contents);
  };

  YXml.prototype.remove = function() {
    var c, i, parent, _i, _len, _ref;
    parent = this._model.val("parent");
    if (parent instanceof YXml) {
      _ref = parent.getChildren();
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        c = _ref[i];
        if (c === this) {
          parent._model["delete"](i);
          break;
        }
      }
    }
    return void 0;
  };

  YXml.prototype.removeAttr = function(attrName) {
    if (attrName === "class") {
      this._model.val("classes", new Y.Object());
    } else {
      this._model.val("attributes")["delete"](attrName);
    }
    return this;
  };

  YXml.prototype.removeClass = function() {
    var className, _i, _len;
    if (arguments.length === 0) {
      this._model.val("classes", new Y.Object());
    } else {
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        className = arguments[_i];
        this._model.val("classes")["delete"](className);
      }
    }
    return this;
  };

  YXml.prototype.toggleClass = function() {
    var className, classes, _i, _len;
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      className = arguments[_i];
      classes = this._model.val("classes");
      if (classes.val(className) != null) {
        classes["delete"](className);
      } else {
        classes.val(className, true);
      }
    }
    return this;
  };

  YXml.prototype.getParent = function() {
    return this._model.val("parent");
  };

  YXml.prototype.getChildren = function() {
    return this._model.val("children").val();
  };

  return YXml;

})();

if (typeof window !== "undefined" && window !== null) {
  if (window.Y != null) {
    window.Y.Xml = YXml;
  } else {
    throw new Error("You must first import Y!");
  }
}

if (typeof module !== "undefined" && module !== null) {
  module.exports = YXml;
}