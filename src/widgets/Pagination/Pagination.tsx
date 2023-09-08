import { useState, useEffect, useRef } from 'react';
import { Pagination as AntPagination } from 'antd';

interface PaginationProps {
  count: number | null;
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const showTotal = (total: number) => `Total ${total} items`;

const Pagination = ({ count, loading, currentPage, onPageChange }: PaginationProps) => {
  const [total, setTotal] = useState(count || 0);
  const totalRef = useRef<number>();

  useEffect(() => {
    if (count !== null && count !== totalRef.current) {
      totalRef.current = count;
      setTotal(count);
    }
  }, [count]);

  return (
    <>
      <AntPagination
        total={total}
        current={currentPage}
        disabled={loading}
        pageSize={20}
        showTotal={showTotal}
        onChange={onPageChange}
        showSizeChanger={false}
      />
    </>
  );
};

export { Pagination };
