declare module 'sweetalert2' {
    /**
     * Shorthand function to display a simple SweetAlert modal.
     *
     * ex.
     *   import swal from 'sweetalert2';
     *   swal('The Internet?', 'That thing is still around?', 'question');
     */
    function swal(title: string, message?: string, type?: SweetAlertType): Promise<any>;

    /**
     * Function to display a SweetAlert modal, with an object of options, all being optional.
     * See the SweetAlertOptions interface for the list of accepted fields and values.
     *
     * ex.
     *   import swal from 'sweetalert2';
     *   swal({
     *     title: 'Auto close alert!',
     *     text: 'I will close in 2 seconds.',
     *     timer: 2000
     *   })
     */
    function swal(settings: SweetAlertOptions): Promise<any>;

    /**
     * A namespace inside the default function, containing utility function for controlling the currently-displayed
     * modal.
     *
     * ex.
     *   import swal from 'sweetalert2';
     *
     *   swal('Hey user!', 'I don\'t like you.', 'warning');
     *
     *   if(swal.isVisible()) { // instant regret
     *     swal.close();
     *   }
     */
    namespace swal {
        /**
         * Determine if modal is shown.
         * Be aware that the library returns a trueish or falsy value, not a real boolean.
         */
        function isVisible(): boolean;

        /**
         * If you end up using a lot of the same settings when calling SweetAlert2,
         * you can use setDefaults at the start of your program to set them once and for all!
         */
        function setDefaults(defaultOptions: SweetAlertOptions): void;

        /**
         * Resets settings to their default value.
         */
        function resetDefaults(): void;

        /**
         * Close the currently open SweetAlert2 modal programmatically.
         */
        function close(onComplete?: (modalElement: HTMLElement) => void): void;

        /**
         * Get the modal title.
         */
        function getTitle(): HTMLElement;

        /**
         * Get the modal content.
         */
        function getContent(): HTMLElement;

        /**
         * Get the image.
         */
        function getImage(): HTMLElement;

        /**
         * Get the "Confirm" button.
         */
        function getConfirmButton(): HTMLElement;

        /**
         * Get the "Cancel" button.
         */
        function getCancelButton(): HTMLElement;

        /**
         * Get the buttons wrapper.
         */
        function getButtonsWrapper(): HTMLElement;

        /**
         * Get actions (buttons) wrapper.
         */
        function getActions(): HTMLElement;

        /**
         * Get the modal footer.
         */
        function getFooter(): HTMLElement;

        /**
         * Enable "Confirm" and "Cancel" buttons.
         */
        function enableButtons(): void;

        /**
         * Disable "Confirm" and "Cancel" buttons.
         */
        function disableButtons(): void;

        /**
         * Enable the "Confirm"-button only.
         */
        function enableConfirmButton(): void;

        /**
         * Disable the "Confirm"-button only.
         */
        function disableConfirmButton(): void;

        /**
         * Disable buttons and show loader. This is useful with AJAX requests.
         */
        function showLoading(): void;

        /**
         * Enable buttons and hide loader.
         */
        function hideLoading(): void;

        /**
         * Determine if modal is in the loading state.
         */
        function isLoading(): boolean;

        /**
         * Click the "Confirm"-button programmatically.
         */
        function clickConfirm(): void;

        /**
         * Click the "Cancel"-button programmatically.
         */
        function clickCancel(): void;

        /**
         * Show validation error message.
         */
        function showValidationError(error: string): void;

        /**
         * Hide validation error message.
         */
        function resetValidationError(): void;

        /**
         * Get the input DOM node, this method works with input parameter.
         */
        function getInput(): HTMLElement;

        /**
         * Disable input. A disabled input element is unusable and un-clickable.
         */
        function disableInput(): void;

        /**
         * Enable input.
         */
        function enableInput(): void;

        /**
         * Provide array of SweetAlert2 parameters to show multiple modals, one modal after another.
         */
        function queue(steps: Array<SweetAlertOptions | string>): Promise<any>;

        /**
         * Get the index of current modal in queue. When there's no active queue, null will be returned.
         */
        function getQueueStep(): string | null;

        /**
         * Insert a modal to queue, you can specify modal positioning with second parameter.
         * By default a modal will be added to the end of a queue.
         */
        function insertQueueStep(step: SweetAlertOptions, index?: number): number;

        /**
         * Delete a modal at index from queue.
         */
        function deleteQueueStep(index: number): void;

        /**
         * Progress steps getter.
         */
        function getProgressSteps(): string[];

        /**
         * Progress steps setter.
         */
        function setProgressSteps(steps: string[]): void;

        /**
         * Show progress steps.
         */
        function showProgressSteps(): void;

        /**
         * Hide progress steps.
         */
        function hideProgressSteps(): void;

        /**
         * Determine if parameter name is valid.
         */
        function isValidParameter(paramName: string): boolean;

        /**
         * An utility function to make SweetAlert rejections silencious (no error in the console when clicking Cancel).
         * ex. swal(...).catch(swal.noop)
         */
        function noop(): void;
    }

    export type SweetAlertType = 'success' | 'error' | 'warning' | 'info' | 'question' | undefined;

    export type SweetAlertInputType =
        'text' | 'email' | 'password' | 'number' | 'tel' | 'range' | 'textarea' | 'select' | 'radio' | 'checkbox' |
        'file' | 'url' | undefined;

    export enum SweetAlertDismissReason {
        cancel = 'cancel',
        backdrop = 'overlay',
        close = 'close',
        esc = 'esc',
        timer = 'timer',
    }

    export type SweetAlertBooleanFunction = () => boolean;

    export type SweetAlertInputOptions = Map<string, string> | { [inputValue: string]: string };

    export interface SweetAlertInputAttributes {
        [attribute: string]: string;
    }

    export interface SweetAlertOptions {
        /**
         * The title of the modal, as HTML.
         * It can either be added to the object under the key "title" or passed as the first parameter of the function.
         *
         * @default null
         */
        title?: string;

        /**
         * The title of the modal, as text. Useful to avoid HTML injection.
         *
         * @default null
         */
        titleText?: string;

        /**
         * A description for the modal.
         * It can either be added to the object under the key "text" or passed as the second parameter of the function.
         *
         * @default null
         */
        text?: string;

        /**
         * A HTML description for the modal.
         * If "text" and "html" parameters are provided in the same time, "text" will be used.
         *
         * @default null
         */
        html?: string | JQuery;

        /**
         * The footer of the modal, as HTML.
         *
         * @default null
         */
        footer?: string | JQuery;

        /**
         * The type of the modal.
         * SweetAlert2 comes with 5 built-in types which will show a corresponding icon animation: 'warning', 'error',
         * 'success', 'info' and 'question'.
         * It can either be put in the array under the key "type" or passed as the third parameter of the function.
         *
         * @default null
         */
        type?: SweetAlertType;

        /**
         * Whether or not SweetAlert2 should show a full screen click-to-dismiss backdrop.
         * Either a boolean value or a css background value (hex, rgb, rgba, url, etc.)
         *
         * @default true
         */
        backdrop?: boolean | string;

        /**
         * Whether or not an alert should be treated as a toast notification.
         * This option is normally coupled with the `position` parameter and a timer.
         * Toasts are NEVER autofocused.
         *
         * @default false
         */
        toast?: boolean;

        /**
         * The container element for adding modal into (query selector only).
         *
         * @default 'body'
         */
        target?: string;

        /**
         * Input field type, can be text, email, password, number, tel, range, textarea, select, radio, checkbox, file
         * and url.
         *
         * @default null
         */
        input?: SweetAlertInputType;

        /**
         * Modal window width, including paddings (box-sizing: border-box). Can be in px or %.
         *
         * @default null
         */
        width?: number | string;

        /**
         * Modal window padding.
         *
         * @default null
         */
        padding?: number;

        /**
         * Modal window background (CSS background property).
         *
         * @default '#fff'
         */
        background?: string;

        /**
         * Modal window position
         *
         * @default 'center'
         */
        position?:
            'top' | 'top-start' | 'top-end' | 'top-left' | 'top-right' |
            'center' | 'center-start' | 'center-end' | 'center-left' | 'center-right' |
            'bottom' | 'bottom-start' | 'bottom-end' | 'bottom-left' | 'bottom-right';

        /**
         * Modal window grow direction
         *
         * @default false
         */
        grow?: 'row' | 'column' | 'fullscreen' | false;

        /**
         * A custom CSS class for the modal.
         *
         * @default null
         */
        customClass?: string;

        /**
         * Auto close timer of the modal. Set in ms (milliseconds).
         *
         * @default null
         */
        timer?: number;

        /**
         * If set to false, modal CSS animation will be disabled.
         *
         * @default true
         */
        animation?: boolean;

        /**
         * If set to false, the user can't dismiss the modal by clicking outside it.
         * You can also pass a custom function returning a boolean value, e.g. if you want
         * to disable outside clicks for the loading state of a modal.
         *
         * @default true
         */
        allowOutsideClick?: boolean | SweetAlertBooleanFunction;

        /**
         * If set to false, the user can't dismiss the modal by pressing the Escape key.
         * You can also pass a custom function returning a boolean value, e.g. if you want
         * to disable the escape key for the loading state of a modal.
         *
         * @default true
         */
        allowEscapeKey?: boolean | SweetAlertBooleanFunction;

        /**
         * If set to false, the user can't confirm the modal by pressing the Enter or Space keys,
         * unless they manually focus the confirm button.
         * You can also pass a custom function returning a boolean value.
         *
         * @default true
         */
        allowEnterKey?: boolean | SweetAlertBooleanFunction;

        /**
         * If set to false, a "Confirm"-button will not be shown.
         * It can be useful when you're using custom HTML description.
         *
         * @default true
         */
        showConfirmButton?: boolean;

        /**
         * If set to true, a "Cancel"-button will be shown, which the user can click on to dismiss the modal.
         *
         * @default false
         */
        showCancelButton?: boolean;

        /**
         * Use this to change the text on the "Confirm"-button.
         *
         * @default 'OK'
         */
        confirmButtonText?: string;

        /**
         * Use this to change the text on the "Cancel"-button.
         *
         * @default 'Cancel'
         */
        cancelButtonText?: string;

        /**
         * Use this to change the background color of the "Confirm"-button (must be a HEX value).
         *
         * @default '#3085d6'
         */
        confirmButtonColor?: string;

        /**
         * Use this to change the background color of the "Cancel"-button (must be a HEX value).
         *
         * @default '#aaa'
         */
        cancelButtonColor?: string;

        /**
         * A custom CSS class for the "Confirm"-button.
         *
         * @default null
         */
        confirmButtonClass?: string;

        /**
         * A custom CSS class for the "Cancel"-button.
         *
         * @default null
         */
        cancelButtonClass?: string;

        /**
         * Use this to change the aria-label for the "Confirm"-button.
         *
         * @default ''
         */
        confirmButtonAriaLabel?: string;

        /**
         * Use this to change the aria-label for the "Cancel"-button.
         *
         * @default ''
         */
        cancelButtonAriaLabel?: string;

        /**
         * Whether to apply the default swal2 styling to buttons.
         * If you want to use your own classes (e.g. Bootstrap classes) set this parameter to false.
         *
         * @default true
         */
        buttonsStyling?: boolean;

        /**
         * Set to true if you want to invert default buttons positions.
         *
         * @default false
         */
        reverseButtons?: boolean;

        /**
         * Set to false if you want to focus the first element in tab order instead of "Confirm"-button by default.
         *
         * @default true
         */
        focusConfirm?: boolean;

        /**
         * Set to true if you want to focus the "Cancel"-button by default.
         *
         * @default false
         */
        focusCancel?: boolean;

        /**
         * Set to true to show close button in top right corner of the modal.
         *
         * @default false
         */
        showCloseButton?: boolean;

        /**
         * Use this to change the `aria-label` for the close button.
         *
         * @default 'Close this dialog'
         */
        closeButtonAriaLabel?: string;

        /**
         * Set to true to disable buttons and show that something is loading. Useful for AJAX requests.
         *
         * @default false
         */
        showLoaderOnConfirm?: boolean;

        /**
         * Function to execute before confirm, may be async (Promise-returning) or sync.
         *
         * ex.
         *   swal({
         *    title: 'Multiple inputs',
         *    html:
         *      '<input id="swal-input1" class="swal2-input">' +
         *      '<input id="swal-input2" class="swal2-input">',
         *    focusConfirm: false,
         *    preConfirm: () => [$('#swal-input1').val(), $('#swal-input2').val()]
         *  }).then(result => swal(JSON.stringify(result));
         *
         * @default null
         */
        preConfirm?: (inputValue: any) => Promise<any | void> | any | void;

        /**
         * Add a customized icon for the modal. Should contain a string with the path or URL to the image.
         *
         * @default null
         */
        imageUrl?: string;

        /**
         * If imageUrl is set, you can specify imageWidth to describes image width in px.
         *
         * @default null
         */
        imageWidth?: number;

        /**
         * If imageUrl is set, you can specify imageHeight to describes image height in px.
         *
         * @default null
         */
        imageHeight?: number;

        /**
         * An alternative text for the custom image icon.
         *
         * @default ''
         */
        imageAlt?: string;

        /**
         * A custom CSS class for the customized icon.
         *
         * @default null
         */
        imageClass?: string;

        /**
         * Input field placeholder.
         *
         * @default ''
         */
        inputPlaceholder?: string;

        /**
         * Input field initial value.
         *
         * @default ''
         */
        inputValue?: any;

        /**
         * If input parameter is set to "select" or "radio", you can provide options.
         * Object keys will represent options values, object values will represent options text values.
         */
        inputOptions?: SweetAlertInputOptions | Promise<SweetAlertInputOptions>;

        /**
         * Automatically remove whitespaces from both ends of a result string.
         * Set this parameter to false to disable auto-trimming.
         *
         * @default true
         */
        inputAutoTrim?: boolean;

        /**
         * HTML input attributes (e.g. min, max, step, accept...), that are added to the input field.
         *
         * ex.
         *   swal({
         *     title: 'Select a file',
         *     input: 'file',
         *     inputAttributes: {
         *       accept: 'image/*'
         *     }
         *   })
         *
         * @default null
         */
        inputAttributes?: SweetAlertInputAttributes;

        /**
         * Validator for input field, may be async (Promise-returning) or sync.
         *
         * ex.
         *   swal({
         *     title: 'Select color',
         *     input: 'radio',
         *     inputValidator: result => !result && 'You need to select something!'
         *   })
         *
         * @default null
         */
        inputValidator?: (inputValue: any) => Promise<string | null> | string | null;

        /**
         * A custom CSS class for the input field.
         *
         * @default null
         */
        inputClass?: string;

        /**
         * Progress steps, useful for modal queues, see usage example.
         *
         * @default []
         */
        progressSteps?: string[];

        /**
         * Current active progress step.
         *
         * @default swal.getQueueStep()
         */
        currentProgressStep?: string;

        /**
         * Distance between progress steps.
         *
         * @default null
         */
        progressStepsDistance?: string;

        /**
         * Function to run when modal built, but not shown yet. Provides modal DOM element as the first argument.
         *
         * @default null
         */
        onBeforeOpen?: (modalElement: HTMLElement) => void;

        /**
         * Function to run when modal opens, provides modal DOM element as the first argument.
         *
         * @default null
         */
        onOpen?: (modalElement: HTMLElement) => void;

        /**
         * Function to run when modal closes, provides modal DOM element as the first argument.
         *
         * @default null
         */
        onClose?: (modalElement: HTMLElement) => void;

        /**
         * Determines whether dismissals (outside click, cancel button, close button, Esc key, timer) should
         * resolve with an object of the format `{ dismiss: SweetAlertDismissReason }` or reject the promise.
         *
         * @default false
         * @deprecated
         */
        useRejections?: boolean;

        /**
         * Determines whether given `inputValidator` and `preConfirm` functions should be expected to to signal
         * validation errors by rejecting, or by their respective means (see documentation for each option).
         *
         * @default false
         * @deprecated
         */
        expectRejections?: boolean;
    }

    export default swal;
}

/**
 * These interfaces aren't provided by SweetAlert2, but its definitions use them.
 * They will be merged with 'true' definitions.
 */

// tslint:disable:no-empty-interface

interface JQuery {
}

interface Promise<T> {
}

interface Map<K, V> {
}
