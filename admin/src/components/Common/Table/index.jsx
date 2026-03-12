import Loading from '../Loading';

const Table = ({
    columns = [],
    data = [],
    loading = false,
    emptyMessage = "Không tìm thấy dữ liệu phù hợp",
    className = "",
    rowClassName = (item) => "",
    pagination = null // { currentPage, totalPages, onPageChange }
}) => {
    return (
        <div className={`table-responsive ${className}`}>
            <table className="table align-middle table-hover mb-0">
                <thead className="table-light">
                    <tr>
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                scope="col"
                                className={col.className || ""}
                                style={col.style || {}}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-5">
                                <Loading center text="Đang tải dữ liệu..." />
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-5 text-muted">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item, rowIdx) => (
                            <tr
                                key={item._id || item.id || rowIdx}
                                className={rowClassName(item, rowIdx)}
                            >
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className={col.className || ""}>
                                        {col.render
                                            ? col.render(item, rowIdx)
                                            : (item[col.key] || "-")
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            
            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
                <div className="d-flex justify-content-center p-3 border-top bg-light">
                    <nav>
                        <ul className="pagination mb-0">
                            <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                >
                                    Trước
                                </button>
                            </li>
                            
                            {[...Array(pagination.totalPages)].map((_, i) => (
                                <li className={`page-item ${pagination.currentPage === i + 1 ? 'active' : ''}`} key={i}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => pagination.onPageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            
                            <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                >
                                    Sau
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default Table;
