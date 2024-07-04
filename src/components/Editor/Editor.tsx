import React, { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { ReactQuillProps, UnprivilegedEditor } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import { DelimiterType } from '../../types/commonTypes';
import './Editor.css'
Quill.register('modules/imageResize', ImageResize);

const wrapSelection = (quill: any, leftDelimiter: string, rightDelimiter: string) => {
    const range = quill.getSelection();
    if (range) {
        const text = quill.getText(range.index, range.length);
        quill.deleteText(range.index, range.length);
        quill.insertText(range.index, `${leftDelimiter}${text}${rightDelimiter}`);
        quill.setSelection(range.index + leftDelimiter.length, text.length);
    }
};



class DelimiterDropdown {
    private quill: any;
    private options: DelimiterType[];
    private onSelect: (selected: DelimiterType) => void;

    constructor(quill: any, options: any) {
        this.quill = quill;
        this.options = options.delimiters || [];
        this.onSelect = options.onSelect;

        const container = document.createElement('span');
        container.className = 'ql-formats';
        container.innerHTML = `
            <span class="ql-picker ql-delimiter">
                <span class="ql-picker-label" tabindex="0" role="button" aria-expanded="false">
                    <svg viewBox="0 0 18 18">
                        <polygon class="ql-stroke" points="7 11 9 13 11 11 7 11"></polygon>
                        <polygon class="ql-stroke" points="7 7 9 5 11 7 7 7"></polygon>
                    </svg>
                </span>
                <span class="ql-picker-options">
                    ${this.options
            .map(
                (option) => `
                        <span class="ql-picker-item" data-value="${option.label}" role="button" tabindex="0">
                            ${option.label}
                        </span>
                    `
            )
            .join('')}
                </span>
            </span>
        `;

        const picker = container.querySelector('.ql-picker') as HTMLElement;
        const label = picker.querySelector('.ql-picker-label') as HTMLElement;
        const optionsContainer = picker.querySelector('.ql-picker-options') as HTMLElement;

        label.addEventListener('click', () => {
            const expanded = label.getAttribute('aria-expanded') === 'true';
            label.setAttribute('aria-expanded', (!expanded).toString());
            picker.classList.toggle('ql-expanded');
        });


        optionsContainer.addEventListener('click', (event: Event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains('ql-picker-item')) {
                const value = target.getAttribute('data-value') as string;
                const selected = this.options.find((opt) => opt.label === value);
                if (selected) {
                    this.onSelect(selected);
                    this.updateLabel(selected);
                    picker.classList.remove('ql-expanded');
                    label.setAttribute('aria-expanded', 'false');
                }
            }
        });


        this.quill.container.previousElementSibling.appendChild(container);
    }
    updateLabel(selected: DelimiterType) {
        const label = this.quill.container.previousElementSibling.querySelector('.ql-delimiter .ql-picker-label');
        if (label) {
            label.setAttribute('data-value', selected.label);
        }
    }
}
Quill.register('modules/delimiterDropdown', DelimiterDropdown);

class WrapButton {
    private quill: any;
    private wrapSelection: () => void;

    constructor(quill: any, options: any) {
        this.quill = quill;
        this.wrapSelection = options.wrapSelection;

        const container = document.createElement('span');
        container.className = 'ql-formats';
        container.innerHTML = `
            <button class="ql-wrap">
                <svg viewbox="0 0 18 18">
                    <polyline class="ql-even ql-stroke" points="5 7 3 9 5 11"/>
                    <polyline class="ql-even ql-stroke" points="13 7 15 9 13 11"/>
                    <line class="ql-stroke" x1="10" x2="8" y1="5" y2="13"/>
                </svg>
            </button>
        `;

        const wrapButton = container.querySelector('.ql-wrap') as HTMLButtonElement;
        wrapButton.addEventListener('click', () => this.wrapSelection());

        this.quill.container.previousElementSibling.appendChild(container);
    }
}
Quill.register('modules/wrapButton', WrapButton);

interface EditorProps extends ReactQuillProps {
    placeholder: string;
    onChange: (content: string) => void;
    value: string;
    selectedDelimiter: DelimiterType;
    delimiterOptions: DelimiterType[];
    isHtmlMode: boolean;
    onHtmlChange: (html: string) => void;


}

interface EditorState {
    theme: string;
    currentDelimitor:DelimiterType;
}

class Editor extends Component<EditorProps, EditorState> {
    static modules: ReactQuillProps['modules'] = {
        toolbar: {
            container: [
                [{ font: [] }],
                [{ color: [] }],
                [{ background: [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                [{ header: [] }, { size: [] }],
                ['link', 'image', 'video'],
                ['clean'],
            ],
        },
        delimiterDropdown: {
            delimiters: [],
            onSelect: () => {},
            selectedDelimiter: null
        },
        wrapButton: {
            wrapSelection: () => {},
        },
        clipboard: {
            matchVisual: false,
        },
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize', 'Toolbar']
        },
    };

    static formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'video',
        'color',
        'background',
    ];

    quillRef: React.RefObject<ReactQuill>;

    constructor(props: EditorProps) {
        super(props);
        this.state = {
            theme: 'snow',
            currentDelimitor:this.props.selectedDelimiter
        };
        this.handleChange = this.handleChange.bind(this);
        this.quillRef = React.createRef();

        if(Editor.modules)
            Editor.modules.delimiterDropdown.delimiters = props.delimiterOptions;
    }

    componentDidMount() {
        if (this.quillRef.current) {
            const quill = this.quillRef.current.getEditor();

            const delimiterDropdown = quill.getModule('delimiterDropdown');
            delimiterDropdown.options.delimiters = this.props.delimiterOptions;

            delimiterDropdown.updateLabel(this.state.currentDelimitor);


            quill.getModule('wrapButton').wrapSelection = this.getWrapSelectionHandler(quill);

            quill.keyboard.addBinding({ key: 'D', shortKey: true }, this.getWrapSelectionHandler(quill));
        }
    }

    componentDidUpdate(prevProps: EditorProps) {
        if (this.props.delimiterOptions !== prevProps.delimiterOptions && this.quillRef.current) {
            const quill = this.quillRef.current.getEditor();
            const delimiterDropdown = quill.getModule('delimiterDropdown');
            delimiterDropdown.options.delimiters = this.props.delimiterOptions;

            if(Editor.modules)
                Editor.modules.delimiterDropdown.delimiters = this.props.delimiterOptions;
        }

        if (this.props.selectedDelimiter !== prevProps.selectedDelimiter) {
            this.setState({ currentDelimitor: this.props.selectedDelimiter });

            if (this.quillRef.current) {
                const quill = this.quillRef.current.getEditor();
                quill.getModule('wrapButton').wrapSelection = this.getWrapSelectionHandler(quill);

                const delimiterDropdown = quill.getModule('delimiterDropdown');
                delimiterDropdown.updateLabel(this.props.selectedDelimiter);
            }
        }
    }


    getWrapSelectionHandler = (quill: any) => () => {
        const { left, right } = this.props.selectedDelimiter;
        wrapSelection(quill, left, right);
    }

    handleChange(content: string, delta: any, source: any, editor: UnprivilegedEditor) {
        if (this.props.onChange) {
            this.props.onChange(content);
        }
    }



    render() {
        return (
            <div>
                {this.props.isHtmlMode ? (
                    <textarea
                        value={this.props.value}
                        onChange={(e) => this.props.onHtmlChange(e.target.value)}
                        style={{ width: '100%', height: '200px' }}
                    />
                ) : (
                    <ReactQuill
                        ref={this.quillRef}
                        theme={this.state.theme}
                        onChange={this.handleChange}
                        value={this.props.value}
                        modules={Editor.modules}
                        formats={Editor.formats}
                        bounds={'#root'}
                        placeholder={this.props.placeholder}
                    />
                )}
            </div>
        );
    }

}

export default Editor;