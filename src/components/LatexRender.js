import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const LatexRender = ({ text }) => {
    const splitLatex = (text) => {
        const regex = /\$(.*?)\$/g
        const split_parts = text.split(regex)
        
        const latexParts = split_parts.map((part, index) => {
            return { text: part, isLatex: index % 2 !== 0 };
            })
        return latexParts
    }
    const parts = splitLatex(text);
  
    return parts.map((part, index) => (
        part.isLatex 
          ? <InlineMath math={part.text} key={index} /> 
          : <span key={index}>{part.text}</span>
    ))
}
    

export default LatexRender
