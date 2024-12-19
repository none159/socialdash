declare module 'emoji-mart' {
    import { Component } from 'react';

    export interface EmojiData {
        id: string;
        name: string;
        unified: string;
        skin: number;
        native: string;
    }

    export interface PickerProps {
        onSelect: (emoji: EmojiData) => void;
        // Add other props as needed, refer to emoji-mart documentation
    }

    export class Picker extends Component<PickerProps> {}
}
