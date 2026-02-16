import React from 'react';
import Loading from '../Loading';

const Table = ({
    columns = [],
    data = [],
    loading = false,
    emptyMessage = "Không tìm thấy dữ liệu phù hợp",
    className = "",
    rowClassName = (item) => ""
}) => {
    return (
        <div className={`table-responsive ${className}`}>
            <table className="table align-middle table-hover">
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
        </div>
    );
};

export default Table;
