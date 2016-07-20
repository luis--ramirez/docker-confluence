require([
    'jquery',
    'underscore',
    'ajs',
    'confluence/setup/setup-tracker',
    'backbone'
],
function(
    $,
    _,
    AJS,
    setupTracker,
    Backbone
) {
    'use strict';

    var BundlePlugin = Backbone.Model.extend({});

    var BundlePluginCollection = Backbone.Collection.extend({
        model: BundlePlugin,
        url: AJS.contextPath() + '/setup/getbundles.action'
    });

    var BundlePluginView = Backbone.View.extend({
        events: {
            'click': '_onClick',
            'keyup textarea': '_onTextareaChange'
        },

        className: 'confluence-setup-choice-box',

        initialize: function (options) {
            this.model.set('selected', options.selected);
        },

        render: function () {
            var plugin = this.model.toJSON();
            var template = $('#bundle-selector-template').html();
            var element = $(_.template(template, {plugin: plugin}));

            // Set initial state
            this._setState(this.model.get('selected'));

            // Attach license expander
            var expanderSource = $('.license-form-expander[bundle-id="'+ plugin.key +'"]');
            if (expanderSource.length) {
                var expanderTarget = element.find('.license-form');

                expanderTarget.empty();
                expanderTarget.append(expanderSource.html());

                // Keep the textarea reference for _onTextareaChange
                this.textarea = expanderTarget.find('textarea');
            }

            this.$el.html(element);
            return this.el;
        },

        _onClick: function (event) {
            if (!($(event.target).is('a') || $(event.target).is('textarea'))) {
                this._setState(!this.model.get('selected'));
            }
        },
        
        _setState: function (selected) {
            if (selected) {
                this.$el.addClass('confluence-setup-choice-box-active');
            } else {
                this.$el.removeClass('confluence-setup-choice-box-active');
                this._setTextarea('');
            }

            this.model.set('selected', selected);
            this.trigger('bundlePluginSelected');
        },

        _setTextarea: function (val) {
            if (this.textarea && this.textarea.length) {
                this.textarea.val(val);
                this._onTextareaChange();
            }
        },

        _onTextareaChange: function () {
            if (this.textarea && this.textarea.length) {
                this.model.set('licenseKey', this.textarea.val());
                this.trigger('textareaChange');
            }
        }
    });

    var BundlePluginListView = Backbone.View.extend({
        el: '#bundle-selector',

        initialize: function (options) {
            this.collection.on('reset', this.render, this);
            this.collection.on('error', this.renderLoadingError, this);
            this.selectedPluginKeys = options.selectedPluginKeys;
        },

        render: function () {
            this.$el.empty();

            for (var i = 0; i < this.collection.length; i++) {
                var model = this.collection.at(i);
                var pluginView = new BundlePluginView({model: model, selected: _.contains(this.selectedPluginKeys, model.get('key'))});

                // Bind events
                this.listenTo(pluginView, 'bundlePluginSelected', _.bind(this._onBundlePluginChanged, this));
                this.listenTo(pluginView, 'textareaChange', _.bind(this._onBundlePluginChanged, this));

                this.$el.append(pluginView.render());
            }
        },

        renderLoadingError: function () {
            var template = $('#loading-error-template').html();
            $('#bundle-selector .loading').html(_.template(template));
        },

        hasSelectedPlugin: function () {
            return this.getSelectPlugins().length > 0;
        },

        getSelectedPluginKeys: function () {
            return _.map(this.getSelectPlugins(), function (plugin) {
                return plugin.get('key');
            }).join(',');
        },

        getSelectPlugins: function () {
            return this.collection.filter(function (item) {
                return item.get('selected');
            });
        },

        _onBundlePluginChanged: function () {
            this.trigger('bundlePluginChanged');
        }
    });

    var SelectBundlePluginsAppView = Backbone.View.extend({
        el: function () {
            this.container = $('#bundle-selector-container');
            this.bindingForm = $('#' + this.container.data('bind-form'));

            return this.bindingForm;
        },

        events: {
            'click #setup-next-button': '_onSubmit'
        },

        initialize: function () {
            // Disable next button until provided license
            this.checkLicense = this.container.hasClass('license-expander');

            // Get selected plugin keys
            var selectedPluginKeysElement = $('#' +this.container.data('selected-plugin-keys-id'));
            if (selectedPluginKeysElement.length) {
                this.selectedPluginKeys = (selectedPluginKeysElement.val() || '').split(',') || [];
            }


            this.collection = new BundlePluginCollection();
            this.bundlePluginListView = new BundlePluginListView({collection: this.collection, selectedPluginKeys: this.selectedPluginKeys});

            // Listen to license key / selection change
            this.listenTo(this.bundlePluginListView, 'bundlePluginChanged', _.bind(this._onBundlePluginChanged, this));

        },

        load: function () {
            this.collection.fetch({
                reset: true
            });
        },

        _onSubmit: function () {
            this.$("#pluginKeys").val(this.bundlePluginListView.getSelectedPluginKeys());

            if (this.bundlePluginListView.hasSelectedPlugin()) {
                _.each(this.bundlePluginListView.getSelectPlugins(), function (bundleData) {
                    setupTracker.insert('confluence.installer.addon.' + bundleData.get('key'));
                });
            }
        },

        _onBundlePluginChanged: function () {
            if (!this.checkLicense) return;

            // Check if user has provided the license key for every selected add-on
            var selectedPlugins = this.bundlePluginListView.getSelectPlugins();
            var missingKeys = _.filter(selectedPlugins, function (selectedPlugin) { return !selectedPlugin.get('licenseKey'); }).length;
            var nextButton = this.bindingForm.find('.setup-next-button');

            if (nextButton.length) {
                nextButton.prop('disabled', !!missingKeys);
            }
        }
    });

    $(function () {
        var appView = new SelectBundlePluginsAppView();
        appView.load();
    });
});
