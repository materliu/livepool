/**
 * @author: Mask
 * @since: 2012-11-17
 * @memo: 跨浏览器的复制至剪切板插件(基于ZeroClipboard)
 * {
    xtype: 'button',
    text: '复制',
    plugins: {
        ptype: 'zeroclipboardplugin',
        // form中某个表单域的name属性，复制内容为此表单域的值
        targetCmpName: 'contentName'
    }
}
{
    xtype: 'button',
    text: '复制',
    plugins: {
        ptype: 'zeroclipboardplugin',
        // 复制内容为function所返回的值
        targetFun: function() {
            return "function所返回的值";
        }
    }
}
{
    xtype: 'button',
    text: '复制',
    plugins: {
        ptype: 'zeroclipboardplugin',
        // 复制的内容
        targetValue: '复制的内容'
    }
}
 */
Ext.define('Ext.ux.ZeroClipboardPlugin', {
    alias: 'plugin.zeroclipboardplugin',
    constructor: function(config) {
        var me = this;
        Ext.apply(me, config);
    },
    init: function(component) {
        var me = this,
            jsLoader;
        me.component = component;
        component.on('boxready', me.initZeroClipboard, me, {
            single: true
        });
        component.on('mouseover', me.glueZeroClipboard, me);
        component.on('mouseout', me.unGlueZeroClipboard, me);
    },
    initZeroClipboard: function() {
        var me = this;
        ZeroClipboard.setMoviePath('/libs/zeroclipboard/ZeroClipboard.swf');
        me.clip = new ZeroClipboard.Client();
        me.clip.setHandCursor(true);
        me.clip.addEventListener("mouseover", Ext.bind(me.onMouseOver, me));
        me.clip.addEventListener('complete', function(client, text) {
            me.clip.hide();
        });
    },
    unGlueZeroClipboard: function() {
        var me = this;
        if (me.clip) {
            me.clip.unglue(me.component.getEl().id);
        }
    },
    glueZeroClipboard: function() {
        var me = this;
        if (me.clip) {
            // me.clip.destroy();
            // ZeroClipboard.destroy();
            me.clip.glue(me.component.getEl().id);
        }
    },
    onMouseOver: function() {
        var me = this,
            value;
        if (me.targetFun) {
            var rs = me.targetFun(me.component);
            value = rs.text;
            var id = rs.id;
            if (id == me.cmp.id) {
                me.clip.setText(value);
            }
        }
    },
    destroy: function() {
        var me = this;
        me.component.clearListeners();
        me.clip.destroy();
        delete me.component;
        delete me.clip;
    }
});
