import React, { useRef, useEffect } from 'react';
import { Resizable, ResizableProps } from 're-resizable';
import styled from "@emotion/styled";
import { debounce } from 'lodash';

const debouncedResizeObserver = debounce((entries: ResizeObserverEntry[]) => {
    entries.forEach((entry) => {
    });
}, 250);

interface ResizableBoxProps extends ResizableProps {
    className?: string;
}

const ResizableBox: React.FC<ResizableBoxProps> = ({ className, children, ...props }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver(debouncedResizeObserver);
        resizeObserver.observe(element);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <Resizable {...props} className={className}>
            <div ref={ref} style={{ height: '100%', width: '100%' }}>
                {children}
            </div>
        </Resizable>
    );
};

const StyledResizableBox = styled(ResizableBox)`
`;

export default StyledResizableBox;