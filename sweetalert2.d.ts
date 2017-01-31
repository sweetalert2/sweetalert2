declare module "sweetalert2" {
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
     * A namespace inside the default function, containing utility function for controlling the currently-displayed modal.
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
        function queue(steps: (SweetAlertOptions|string)[]): Promise<any>;

        /**
         * Get the index of current modal in queue. When there's no active queue, null will be returned.
         */
        function getQueueStep(): string|null;

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
         * An utility function to make SweetAlert rejections silencious (no error in the console when clicking Cancel).
         * ex. swal(...).catch(swal.noop)
         */
        function noop(): void;
    }

    export type SweetAlertType = 'success'|'error'|'warning'|'info'|'question'|undefined;

    export type SweetAlertInputType = 'text'|'email'|'password'|'number'|'tel'|'range'|'textarea'|'select'|'radio'|'checkbox'|'file'|undefined;

    export type SweetAlertInputOptions = { [inputValue: string]: string };

    export interface SweetAlertOptions {
        /**
         * The title of the modal, as HTML.
         * It can either be added to the object under the key "title" or passed as the first parameter of the function.
         * Default: null
         */
        title?: string;

        /**
         * The title of the modal, as text. Useful to avoid HTML injection.
         * Default: null
         */
        titleText?: string;

        /**
         * A description for the modal.
         * It can either be added to the object under the key "text" or passed as the second parameter of the function.
         * Default: null
         */
        text?: string;

        /**
         * A HTML description for the modal.
         * If "text" and "html" parameters are provided in the same time, "text" will be used.
         * Default: null
         */
        html?: string;

        /**
         * The type of the modal.
         * SweetAlert2 comes with 5 built-in types which will show a corresponding icon animation: warning, error, success, info and question.
         * It can either be put in the array under the key "type" or passed as the third parameter of the function.
         * Default: null
         */
        type?: SweetAlertType;

        /**
         * Input field type, can be text, email, password, number, tel, range, textarea, select, radio, checkbox and file.
         * Default: null
         */
        input?: SweetAlertInputType;

        /**
         * Modal window width, including paddings (box-sizing: border-box). Can be in px or %.
         * Default: "500px"
         */
        width?: number|string;

        /**
         * Modal window padding.
         * Default: 20
         */
        padding?: number;

        /**
         * Modal window background (CSS background property).
         * Default: "#fff"
         */
        background?: string;

        /**
         * A custom CSS class for the modal.
         * Default: null
         */
        customClass?: string;

        /**
         * Auto close timer of the modal. Set in ms (milliseconds).
         * Default: null
         */
        timer?: number;

        /**
         * If set to false, modal CSS animation will be disabled.
         * Default: true
         */
        animation?: boolean;

        /**
         * If set to false, the user can't dismiss the modal by clicking outside it.
         * Default: true
         */
        allowOutsideClick?: boolean;

        /**
         * If set to false, the user can't dismiss the modal by pressing the Escape key.
         * Default: true
         */
        allowEscapeKey?: boolean

        /**
         * If set to false, a "Confirm"-button will not be shown.
         * It can be useful when you're using custom HTML description.
         * Default: true
         */
        showConfirmButton?: boolean;

        /**
         * If set to true, a "Cancel"-button will be shown, which the user can click on to dismiss the modal.
         * Default: false
         */
        showCancelButton?: boolean;

        /**
         * Use this to change the text on the "Confirm"-button.
         * Default: "OK"
         */
        confirmButtonText?: string;

        /**
         * Use this to change the text on the "Cancel"-button.
         * Default: "Cancel"
         */
        cancelButtonText?: string;

        /**
         * Use this to change the background color of the "Confirm"-button (must be a HEX value).
         * Default: "#3085d6"
         */
        confirmButtonColor?: string;

        /**
         * Use this to change the background color of the "Cancel"-button (must be a HEX value).
         * Default: "#aaa"
         */
        cancelButtonColor?: string;

        /**
         * A custom CSS class for the "Confirm"-button.
         * Default: null
         */
        confirmButtonClass?: string;

        /**
         * A custom CSS class for the "Cancel"-button.
         * Default: null
         */
        cancelButtonClass?: string;

        /**
         * Whether to apply the default swal2 styling to buttons.
         * If you want to use your own classes (e.g. Bootstrap classes) set this parameter to false.
         * Default: true
         */
        buttonsStyling?: boolean;

        /**
         * Set to true if you want to invert default buttons positions.
         * Default: false
         */
        reverseButtons?: boolean;

        /**
         * Set to true if you want to focus the "Cancel"-button by default.
         * Default: false
         */
        focusCancel?: boolean;

        /**
         * Set to true to show close button in top right corner of the modal.
         * Default: false
         */
        showCloseButton?: boolean;

        /**
         * Set to true to disable buttons and show that something is loading. Useful for AJAX requests.
         * Default: false
         */
        showLoaderOnConfirm?: boolean;

        /**
         * Function to execute before confirm, should return Promise.
         * Default: null
         *
         * ex.
         *   swal({
         *    title: 'Multiple inputs',
         *    html:
         *      '<input id="swal-input1" class="swal2-input" autofocus>' +
         *      '<input id="swal-input2" class="swal2-input">',
         *    preConfirm: () => Promise.resolve([$('#swal-input1').val(), $('#swal-input2').val()])
         *  }).then(result => swal(JSON.stringify(result));
         */
        preConfirm?: (inputValue: any) => Promise<any>;

        /**
         * Add a customized icon for the modal. Should contain a string with the path or URL to the image.
         * Default: null
         */
        imageUrl?: string;

        /**
         * If imageUrl is set, you can specify imageWidth to describes image width in px.
         * Default: null
         */
        imageWidth?: number;

        /**
         * If imageUrl is set, you can specify imageHeight to describes image height in px.
         * Default: null
         */
        imageHeight?: number;

        /**
         * A custom CSS class for the customized icon.
         * Default: null
         */
        imageClass?: string;

        /**
         * Input field placeholder.
         * Default: ""
         */
        inputPlaceholder?: string;

        /**
         * Input field initial value.
         * Default: ""
         */
        inputValue?: any;

        /**
         * If input parameter is set to "select" or "radio", you can provide options.
         * Object keys will represent options values, object values will represent options text values.
         */
        inputOptions?: SweetAlertInputOptions|Promise<SweetAlertInputOptions>;

        /**
         * Automatically remove whitespaces from both ends of a result string.
         * Set this parameter to false to disable auto-trimming.
         * Default: true
         */
        inputAutoTrim?: boolean;

        /**
         * Validator for input field, should return a Promise.
         * Default: null
         *
         * ex.
         *   swal({
         *     title: 'Select color',
         *     input: 'radio',
         *     inputValidator: result => new Promise((resolve, reject) => {
         *       result ? resolve() : reject('You need to select something!');
         *     })
         *   })
         */
        inputValidator?: (result: any) => Promise<void>;

        /**
         * A custom CSS class for the input field.
         * Default: null
         */
        inputClass?: string;

        /**
         * Progress steps, useful for modal queues, see usage example.
         * Default: []
         */
        progressSteps?: SweetAlertOptions[];

        /**
         * Current active progress step.
         * Default: swal.getQueueStep()
         */
        currentProgressStep?: string;

        /**
         * Distance between progress steps.
         * Default: "40px"
         */
        progressStepsDistance?: string;

        /**
         * Function to run when modal opens, provides modal DOM element as the first argument.
         * Default: null
         */
        onOpen?: (modalElement: HTMLElement) => void;

        /**
         * Function to run when modal closes, provides modal DOM element as the first argument.
         * Default: null
         */
        onClose?: (modalElement: HTMLElement) => void;
    }

    export default swal;
}
