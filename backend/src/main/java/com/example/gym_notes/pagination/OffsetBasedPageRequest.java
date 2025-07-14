package com.example.gym_notes.pagination;

import org.springframework.data.domain.AbstractPageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class OffsetBasedPageRequest extends AbstractPageRequest {
    private final long offset;
    private final Sort sort;

    public OffsetBasedPageRequest(long offset, int limit, Sort sort) {
        super((int)(offset / limit), limit);
        if (offset < 0) throw new IllegalArgumentException("Offset must be greater or equal to 0");
        if (limit  < 1) throw new IllegalArgumentException("Limit must be greater or equal to 1!");
        this.offset = offset;
        this.sort   = sort;
    }

    @Override
    public long getOffset() {
        return offset;
    }

    @Override
    public Sort getSort() {
        return sort;
    }

    @Override
    public Pageable next() {
        return new OffsetBasedPageRequest(offset + getPageSize(), getPageSize(), sort);
    }

    @Override
    public Pageable previous() {
        return hasPrevious()
                ? new OffsetBasedPageRequest(Math.max(0, offset - getPageSize()), getPageSize(), sort)
                : this;
    }

    @Override
    public Pageable previousOrFirst() {
        long newOffset = Math.max(0, offset - getPageSize());
        return new OffsetBasedPageRequest(newOffset, getPageSize(), sort);
    }

    @Override
    public Pageable first() {
        return new OffsetBasedPageRequest(0, getPageSize(), sort);
    }

    @Override
    public Pageable withPage(int pageNumber) {
        long newOffset = (long) pageNumber * getPageSize();
        return new OffsetBasedPageRequest(newOffset, getPageSize(), sort);
    }

    @Override
    public boolean hasPrevious() {
        return offset > 0;
    }
}
