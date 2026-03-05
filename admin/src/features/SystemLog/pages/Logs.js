import React, { useEffect, useState } from 'react';
import { Card, Table, Spinner, Badge, Form, Row, Col, Pagination } from 'react-bootstrap';
import logApi from '../../../api/logApi';

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState({ resource: '', action: '' });

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const res = await logApi.getAll({ page, ...filter });
                if (res.success) {
                    setLogs(res.logs);
                    setTotalPages(Math.ceil(res.logCount / res.resPerPage));
                }
            } catch (error) {
                console.error('Lỗi khi tải lịch sử:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [page, filter]);

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
        setPage(1);
    };

    const getActionBadge = (action) => {
        switch (action) {
            case 'CREATE': return 'success';
            case 'UPDATE': return 'warning';
            case 'DELETE': return 'danger';
            default: return 'info';
        }
    };

    return (
        <div className="logs-page p-4">
            <h2 className="mb-4 text-gray-800 font-weight-bold">Lịch Sử Hoạt Động</h2>

            <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                    <Row>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Thao tác</Form.Label>
                                <Form.Control as="select" name="action" value={filter.action} onChange={handleFilterChange}>
                                    <option value="">Tất cả</option>
                                    <option value="CREATE">Thêm mới</option>
                                    <option value="UPDATE">Cập nhật</option>
                                    <option value="DELETE">Xoá</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Đối tượng</Form.Label>
                                <Form.Control as="select" name="resource" value={filter.resource} onChange={handleFilterChange}>
                                    <option value="">Tất cả</option>
                                    <option value="Order">Đơn hàng</option>
                                    <option value="Product">Sản phẩm</option>
                                    <option value="Category">Danh mục</option>
                                    <option value="Ingredient">Nguyên liệu</option>
                                    <option value="User">Người dùng</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6} className="d-flex align-items-end justify-content-end">
                            {totalPages > 1 && (
                                <Pagination className="mb-0">
                                    <Pagination.Prev
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                    />
                                    {[...Array(totalPages)].map((_, idx) => (
                                        <Pagination.Item
                                            key={idx + 1}
                                            active={idx + 1 === page}
                                            onClick={() => setPage(idx + 1)}
                                        >
                                            {idx + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                    />
                                </Pagination>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="shadow-sm border-0">
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center p-5">
                            <Spinner animation="border" variant="danger" />
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="border-0">Thời gian</th>
                                        <th className="border-0">Người thực hiện</th>
                                        <th className="border-0">Thao tác</th>
                                        <th className="border-0">Đối tượng</th>
                                        <th className="border-0">Chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log._id}>
                                            <td>{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                                            <td>{log.user ? `${log.user.name} (${log.user.email})` : 'Hệ thống'}</td>
                                            <td>
                                                <Badge bg={getActionBadge(log.action)} className="px-3 py-2 rounded-pill">
                                                    {log.action}
                                                </Badge>
                                            </td>
                                            <td>{log.resource}</td>
                                            <td>{log.details}</td>
                                        </tr>
                                    ))}
                                    {logs.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted p-4">
                                                Không có dữ liệu lịch sử
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default Logs;
