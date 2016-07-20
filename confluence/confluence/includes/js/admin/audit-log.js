define('confluence/admin/audit-log', [
    'jquery',
    'ajs',
    'confluence/templates',
    'aui/templates',
    'moment',
    'confluence/api/querystring'
], function ($, AJS, Templates, aui, moment, querystring) {
    'use strict';

    return function AuditLogging(config) {
        var auditLogUrl = AJS.contextPath() + '/rest/api/audit';
        var auditRetentionUrl = AJS.contextPath() + '/rest/api/audit/retention';

        var pageSize = config.pageSize;
        var pageLimit = config.pageLimit;
        if (pageLimit < 1 || pageLimit % 2 !== 1) {
            throw "pageLimit should be odd positive number. Got '" + config.pageLimit + "'";
        }
        var halfPageLimit = Math.floor(pageLimit / 2);

        var retentionState = {};

        function initState() {
            // Set initial state
            var query = querystring.parse(window.location.search);
            history.replaceState({
                start: query.start && query.start[0] ? parseInt(query.start[0], 10) : 0,
                searchString: query.searchString && query.searchString[0] ? decodeURIComponent(query.searchString[0]) : undefined,
                number: query.number && query.number[0] ? parseInt(query.number[0], 10) : undefined,
                units: query.units ? query.units[0] : undefined,
                fromDate: query.fromDate ? query.fromDate[0] : undefined,
                toDate: query.toDate ? query.toDate[0] : undefined
            }, '');
        }

        // Audit log settings dialog
        function initialiseSettingsDialog() {
            var settingsDialog = AJS.dialog2('#settings-dialog');
            var $settingsDialog = $('#settings-dialog');
            var $submitButton = $('#auditing-retention-submit');
            var $spinner = $settingsDialog.find('.aui-icon-wait');
            var $dialogContent = $settingsDialog.find('.aui-dialog2-content');

            $('#auditing-retention-setting').on('click', {settingsDialog: settingsDialog}, settingsButtonClickHandler);
            settingsDialog.on('hide', hideSettingsHandler);

            $submitButton.on('click', {settingsDialog: settingsDialog, spinner: $spinner, submitButton: $submitButton}, settingsSubmitHandler);

            $('#auditing-retention-cancel').on('click', {settingsDialog: settingsDialog}, settingsCancelHandler);

            $dialogContent.on('render', {settingsDialog: settingsDialog, spinner: $spinner, submitButton: $submitButton}, initialiseSettingsForm);

            renderSettingsDialog($dialogContent);
        }

        function initialiseSettingsForm(e) {
            var $settingsDialog = $('#settings-dialog');
            $settingsDialog.find('.time-unit-value').on('change', {submitButton: e.data.submitButton}, settingsNumberChangeHandler);
            $settingsDialog.find('select.time-unit').on('change', {submitButton: e.data.submitButton}, settingsUnitChangeHandler);
            $('#auditing-settings-form').on('submit', {settingsDialog: e.data.settingsDialog, spinner: e.data.spinner, submitButton: e.data.submitButton}, settingsSubmitHandler);
        }

        function settingsButtonClickHandler(e) {
            e.data.settingsDialog.show();
        }

        function hideSettingsHandler(e) {
            renderSettingsDialog($(e.target).find('.aui-dialog2-content'));
        }

        function settingsNumberChangeHandler(e) {
            retentionState.number = e.currentTarget.value;
            $('#settings-dialog').find('.aui-message-error').remove();
            e.data.submitButton.enable();
        }

        function settingsUnitChangeHandler(e) {
            retentionState.units = e.currentTarget.value;
            $('#settings-dialog').find('.aui-message-error').remove();
            e.data.submitButton.enable();
        }

        function settingsCancelHandler(e) {
            e.preventDefault();
            e.data.settingsDialog.hide();
        }

        function settingsSubmitHandler(e) {
            e.preventDefault();
            e.data.spinner.removeClass('hidden');
            e.data.submitButton.disable();

            $.ajax({
                type: 'PUT',
                url: auditRetentionUrl,
                contentType: 'application/json',
                        data: JSON.stringify(retentionState)
            })
                    .done(function () {
                        e.data.settingsDialog.hide();
                    })
                    .fail(function (error) {
                        AJS.messages.error('#settings-dialog .aui-dialog2-content', {
                            title: AJS.I18n.getText('logged.event.setting.error.title'),
                            body: JSON.parse(error.responseText).message,
                            closeable: false
                        });
                    })
                    .always(function () {
                        e.data.spinner.addClass('hidden');
                    });
        }

        function renderSettingsDialog($dialogContent) {
            $.get(auditRetentionUrl, function (data) {
                retentionState = data;

                var $auditSettingContent = $(Templates.Auditing.settingsDialogContent({currentRetention: data}));
                $dialogContent.html($auditSettingContent);
                $dialogContent.trigger('render');
            });
        }

        // Audit log export
        function initializeExport() {
            $('#auditing-export-data').on('click', exportDataHandler);
        }

        function exportDataHandler() {
            var $exportForm = $('#export-form');
            removeFormFields($exportForm);

            var state = history.state;
            if (state.searchString) {
                $exportForm.append($(aui.form.input({name: 'searchString', type: 'text', extraClasses: 'hidden', value: state.searchString})));
            }

            if (state.fromDate) {
                $exportForm.append($(aui.form.input({
                    name: 'startDate',
                    type: 'number',
                    extraClasses: 'hidden',
                    value: moment(state.fromDate).utc().valueOf()
                })));
            }

            if (state.toDate) {
                $exportForm.append($(aui.form.input({
                    name: 'endDate',
                    type: 'number',
                    extraClasses: 'hidden',
                    // toDate is inclusive
                    value: moment(state.toDate).add(1, 'days').subtract(1, 'milliseconds').utc().valueOf()
                })));
            }

            if (state.number && state.units) {
                var startDate = moment().subtract(state.number, state.units).valueOf();
                $exportForm.append($(aui.form.input({name: 'startDate', type: 'number', extraClasses: 'hidden', value: startDate})));
            }

            $exportForm.submit();
        }

        function removeFormFields($exportForm) {
            $exportForm.find('input:not([type="submit"])').remove();
        }

        // Audit log text search
        function searchSubmitHandler(e) {
            e.preventDefault();
            modifyState({
                start: 0,
                searchString: e.data.val()
            });
        }

        function initializeSearchForm() {
            var searchForm = $('.search-container form');
            var searchEntry = searchForm.find('.search-entry');
            searchEntry.val(history.state.searchString);
            searchForm.on('submit', searchEntry, searchSubmitHandler);
        }

        // Audit log time filter
        function initializeTimeFilter() {
            require(['aui/inline-dialog2']);

            var $timeFilterDialog = $('#time-filter-dialog');
            var $fromDatePicker = $('#from-date-picker');
            var $toDatePicker = $('#to-date-picker');
            var $wtlInput = $('#wtl_input');
            $timeFilterDialog.find('.buttons input').on('click', submitTimeFilterHandler);
            $timeFilterDialog.find('.cancel').on('click', cancelTimeFilterHandler);

            document.querySelector('#time-filter-dialog').addEventListener('aui-layer-show', resetTimeFilterDialog);

            $fromDatePicker.datePicker({
                overrideBrowserDefault: true
            });

            $toDatePicker.datePicker({
                overrideBrowserDefault: true
            });

            $fromDatePicker.on('click', selectBetweenDateRange);
            $toDatePicker.on('click', selectBetweenDateRange);
            $wtlInput.on('click', selectWithinTheLastDateRange);
        }

        function selectBetweenDateRange() {
            $('#bet_radio_opt').prop("checked", true);
        }

        function selectWithinTheLastDateRange() {
            $('#wtl_radio_opt').prop("checked", true);
        }

        function updateTimeFilterButton(desc) {
            $('#time-filter').html(AJS.I18n.getText('logged.event.filter.button.text', desc));
        }

        function resetTimeFilterDialog() {
            // clear all errors
            var $errorField = $(this).find('.value-error');
            $errorField.html('');

            var inputType;
            var state = history.state;
            if (state.units) {
                inputType = 'within';
            } else if (state.fromDate || state.toDate) {
                inputType = 'between';
            } else {
                inputType = 'all';
            }

            // reset dialog
            var $dialog = $('#time-filter-dialog');
            $dialog.find('input[value=' + inputType + ']').attr('checked', true);
            $dialog.find('.time-unit').val(state.units);
            $dialog.find('.time-unit-value').val(state.number);
            $dialog.find('#from-date-picker').val(state.fromDate);
            $dialog.find('#to-date-picker').val(state.toDate);
        }

        function submitTimeFilterHandler(e) {
            e.preventDefault();

            var $dialog = $('#time-filter-dialog');
            if (validateAndApplyTimeFilter($dialog)) {
                document.querySelector('#time-filter-dialog').hide();
            }
        }

        function cancelTimeFilterHandler() {
            document.querySelector('#time-filter-dialog').hide();
        }

        function validateAndApplyTimeFilter($timeFilterDialog) {
            var $filterType = $timeFilterDialog.find('input[name=auditDateFilter]:checked');
            var $errorField = $timeFilterDialog.find('.value-error');
            var timeNum;
            var timeUnit;
            var fromDate;
            var toDate;

            if ($filterType.val() === 'within') {
                timeNum = parseInt($timeFilterDialog.find('.time-unit-value').val(), 10);
                timeUnit = $timeFilterDialog.find('select.time-unit').val();

                if (isNaN(timeNum) || timeNum < 1) {
                    $errorField.html(AJS.I18n.getText('logged.event.filter.invalid.number.error'));
                    return false;
                }

                updateState({
                    start: 0,
                    number: timeNum,
                    units: timeUnit,
                    searchString: history.state.searchString
                });
            } else if ($filterType.val() === 'between') {
                var fromDateVal = $timeFilterDialog.find('#from-date-picker').val();
                var toDateVal = $timeFilterDialog.find('#to-date-picker').val();

                if (!fromDateVal || !toDateVal) {
                    $errorField.html(AJS.I18n.getText('logged.event.filter.no.date.error'));
                    return false;
                }

                var splitFromVal = fromDateVal.split('-');
                fromDate = new Date(splitFromVal[0], splitFromVal[1] - 1, splitFromVal[2], 0, 0, 0, 0);

                var splitToVal = toDateVal.split('-');
                toDate = new Date(splitToVal[0], splitToVal[1] - 1, splitToVal[2], 23, 59, 59, 999);

                if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
                    $errorField.html(AJS.I18n.getText('logged.event.filter.invalid.date.error'));
                    return false;
                }

                if (fromDate.getTime() > toDate.getTime()) {
                    $errorField.html(AJS.I18n.getText('logged.event.filter.date.range.error'));
                    return false;
                }

                updateState({
                    start: 0,
                    fromDate: fromDateVal,
                    toDate: toDateVal,
                    searchString: history.state.searchString
                });
            } else { // fetch all audit logs
                updateState({
                    start: 0,
                    searchString: history.state.searchString
                });
            }

            return true;
        }

        function modifyState(state) {
            updateState($.extend({}, history.state, state));
        }

        function updateState(state) {
            var queryParams = {};
            Object.keys(state).forEach(function (key) {
                if (state[key]) {
                    queryParams[key] = [encodeURIComponent(state[key])];
                }
            });
            var query = '?' + querystring.stringify(queryParams);
            history.pushState(state, '', window.location.pathname + query);
            updateUi();
        }

        // Audit log table
        function updateUi() {
            var state = history.state;

            var startDate;
            var endDate;
            var timeFilterDesc;
            if (state.units) {
                endDate = moment().utc().valueOf();
                startDate = endDate - moment.duration(state.number, state.units).asMilliseconds();
                timeFilterDesc = [
                    AJS.I18n.getText('logged.event.filter.within'),
                    state.number,
                    state.units]
                        .join(' ');
            } else if (state.fromDate || state.toDate) {
                if (state.fromDate) {
                    startDate = moment(state.fromDate).valueOf();
                }
                if (state.toDate) {
                    endDate = moment(state.toDate).add(1, 'days').subtract(1, 'milliseconds').valueOf();
                }
                timeFilterDesc = [
                    AJS.I18n.getText('logged.event.filter.between'),
                    state.fromDate,
                    AJS.I18n.getText('and.word'),
                    state.toDate
                ].join(' ');
            } else {
                timeFilterDesc = AJS.I18n.getText('logged.event.filter.all');
            }

            updateTimeFilterButton(timeFilterDesc);

            $.get(auditLogUrl, {
                        startDate: startDate,
                        endDate: endDate,
                        start: state.start,
                        limit: pageSize * 5,
                        searchString: state.searchString
                    })
                    .done(function (data) {
                        var $auditLogTable = $(Templates.Auditing.auditLogTable());
                        var $auditLogRowContainer = $auditLogTable.find('tbody');

                        renderPagination(history.state.start, data.results.length);

                        data.results.slice(0, pageSize).forEach(function renderRow(record) {
                            var dateTime = parseInt(record.creationDate, 10);
                            record.creationDate = moment(dateTime).format("D MMM, YYYY HH:mm:ss");

                            var $recordRow = $(Templates.Auditing.auditLogTableRow({record: record}));
                            $recordRow.on('click', function recordRowHandler(e) {
                                if (e.target.tagName === 'A') { // Avoid toggling when links are clicked
                                    return;
                                }

                                var actionLink = $(this).find('.show-details');
                                var moreText = AJS.I18n.getText('logged.event.see.more');
                                var lessText = AJS.I18n.getText('logged.event.see.less');

                                var actionText = actionLink.text() === lessText ? moreText : lessText;
                                actionLink.text(actionText);
                                $(this).next().toggle();
                            });

                            var $recordDetailsRow = $(Templates.Auditing.recordDetails({record: record}));
                            $auditLogRowContainer.append($recordRow);
                            $auditLogRowContainer.append($recordDetailsRow);
                        });

                        $('#audit-log-container').html($auditLogTable);
                        $('#aui-message-bar').empty();
                    })
                    .fail(function () {
                        AJS.messages.error({
                            body: AJS.I18n.getText('logged.event.fetchError')
                        });
                    });
        }

        // Audit log pagination
        function getPaginationConfig(startIndex, totalRecords) {
            var currentPage = Math.ceil((startIndex + 1) / pageSize);
            var numPages = Math.ceil(totalRecords / pageSize);
            var startPage = Math.min(Math.max(1, currentPage - halfPageLimit), Math.max(1, currentPage + numPages - pageLimit));
            var endPage = Math.max(currentPage + Math.min(halfPageLimit, numPages - 1), Math.min(numPages + currentPage - 1, pageLimit));
            return { currentPage: currentPage, startPage: startPage, endPage: endPage };
        }

        function prevClickHandler(e) {
            e.preventDefault();
            if (!e.target.getAttribute("aria-disabled")) {
                var newStartIndex = Math.max(0, history.state.start - pageSize);
                modifyState({start: newStartIndex});
            }
        }

        function nextClickHandler(e) {
            e.preventDefault();
            if (!e.target.getAttribute("aria-disabled")) {
                var newStartIndex = history.state.start + pageSize;
                modifyState({start: newStartIndex});
            }
        }

        function pageNumberClickHandler(e) {
            e.preventDefault();
            var pageToRender = this.text;
            var newStartIndex = history.state.start + (pageToRender - e.data.currentPage) * pageSize;
            modifyState({start: newStartIndex});
        }

        function renderPagination(startIndex, totalRecords) {
            var $paginationContainers = $('.audit-table-pagination');

            if (totalRecords === 0 || startIndex + totalRecords < pageSize) {
                $paginationContainers.empty();
            }
            else {
                var config = getPaginationConfig(startIndex, totalRecords);
                var $pagination = $(Templates.Auditing.paginationFooter({currentPage: config.currentPage, startPage: config.startPage, endPage: config.endPage}));
                $paginationContainers.html($pagination);

                $paginationContainers.find('.auditing-page-prev').on('click', prevClickHandler);
                $paginationContainers.find('.auditing-page-next').on('click', nextClickHandler);
                $paginationContainers.find('.auditing-page-link').on('click', {currentPage: config.currentPage}, pageNumberClickHandler);
            }
        }

        function init() {
            initState();
            initializeSearchForm();
            initializeTimeFilter();
            initialiseSettingsDialog();
            initializeExport();

            updateUi();

            $(window).on('popstate', function () {
                updateUi();
            });
        }

        return {
            init: init,
            getPaginationConfig: getPaginationConfig
        };
    };
});

require('confluence/module-exporter').safeRequire('confluence/admin/audit-log', function (AuditLogging) {
    'use strict';
    var auditLogging = new AuditLogging({
        pageSize: 50,
        pageLimit: 5
    });
    require('ajs').toInit(auditLogging.init);
});