import { useState, useEffect, useRef } from 'react';
import { Pagination as AntPagination } from 'antd';

interface PaginationProps {
  count: number | null;
  loading: boolean;
  id: string | undefined;
  onPageChange: (page: number) => void;
}

const showTotal = (total: number) => `Total ${total} items`;

const defaultPage = 1;

const Pagination = ({ onPageChange, loading, count, id }: PaginationProps) => {
  const [current, setCurrent] = useState(defaultPage);
  const [total, setTotal] = useState(0);
  const totalRef = useRef<number>();

  const handlePageChange = (page: number) => {
    setCurrent(page);
    onPageChange(page);
  };

  useEffect(() => {
    if (id) {
      setCurrent(defaultPage);
    }
  }, [id]);

  useEffect(() => {
    if (count !== null && count !== totalRef.current) {
      totalRef.current = count;
      setTotal(count);
    }
  }, [count]);

  return (
    <>
      <AntPagination
        showTotal={showTotal}
        current={current}
        disabled={loading}
        pageSize={20}
        total={total}
        showSizeChanger={false}
        onChange={handlePageChange}
      />
    </>
  );
};

export { Pagination };
