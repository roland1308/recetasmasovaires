import React from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

export default (payload) => {
    const theme = 'snow';
    const modules = {
        toolbar: [
            ['bold', 'italic', { list: 'bullet' }],
        ],
    };
    const placeholder = payload.placeholder;
    const formats = ['bold', 'italic', 'list', 'bullet'];
    const { quill, quillRef } = useQuill({ theme, modules, formats, placeholder });
    React.useEffect(() => {
        if (quill) {
            quill.clipboard.dangerouslyPasteHTML(payload.value);
        }
    }, [quill, payload.value]);
    return (
        <div>
            <div className="preparationField" id="quillDiv" ref={quillRef} />
        </div>
    );
};