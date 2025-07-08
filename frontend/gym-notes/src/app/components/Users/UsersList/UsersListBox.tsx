import { useEffect, useRef } from "react";

export default function UsersListBox(props: any) {
    const listRef = useRef<HTMLUListElement>(null);

    const { ownerState, loadMore, ...filteredProps } = props;

    async function checkIfAtBottom() {
        const list = listRef.current;
        if (!list) return;

        const isScrollable = list.scrollHeight > list.clientHeight;
        const isAtBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 1;

        if (!isScrollable || isAtBottom) {
            await loadMore();
        }
    };
    useEffect(() => {
        checkIfAtBottom();
    }, []);


    return (
        <ul {...filteredProps}
            style={{ height: '40vh', fontSize: '2rem', listStyle: 'none', margin: '0', padding: '8px 0', maxHeight: '40vh', overflow: 'auto', position: 'relative' }}
            ref={listRef}
            onScroll={checkIfAtBottom}
        ></ul>
    );
}