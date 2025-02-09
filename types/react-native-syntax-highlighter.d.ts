declare module 'react-native-syntax-highlighter' {
  import { StyleProp, TextStyle } from 'react-native';
  
  interface Props {
    language?: string;
    style?: any;
    customStyle?: StyleProp<TextStyle>;
    children: string;
  }

  export default function SyntaxHighlighter(props: Props): JSX.Element;
}

declare module 'react-syntax-highlighter/styles/prism' {
  export const atomDark: any;
} 