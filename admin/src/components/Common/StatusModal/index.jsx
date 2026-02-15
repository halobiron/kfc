import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const StatusModal = ({ show, onHide, onConfirm, status, statusLabel, loading, title }) => {
    const [note, setNote] = useState('');
    const inputRef = useRef(null);

    // Reset note when modal opens
    useEffect(() => {
        if (show) {
            setNote('');
            // Auto focus input after a short delay to allow modal animation
            setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
            }, 100);
        }
    }, [show]);

    const handleConfirm = () => {
        if (loading) return;
        onConfirm(note);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form submission refresh
        handleConfirm();
    };

    const handleKeyDown = (e) => {
        // Submit on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleConfirm();
        }
    };

    const isCancelAction = status === 'cancelled';
    const displayStatusLabel = statusLabel || status;

    return (
        <Modal show={show} onHide={onHide} centered backdrop={loading ? 'static' : true} keyboard={!loading}>
            <Modal.Header closeButton={!loading} className={isCancelAction ? 'bg-danger text-white' : ''}>
                <Modal.Title>{title || 'Cập nhật trạng thái'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <p className="mb-3">
                        Bạn có chắc muốn chuyển đơn hàng sang trạng thái <strong className={isCancelAction ? 'text-danger' : 'text-primary'}>
                            {displayStatusLabel}
                        </strong> không?
                    </p>
                    <Form.Group className="mb-3">
                        <Form.Label>Ghi chú (tùy chọn):</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Nhập lý do hoặc ghi chú..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            onKeyDown={handleKeyDown}
                            ref={inputRef}
                            disabled={loading}
                        />
                        <Form.Text className="text-muted">
                            Nhấn <strong>Enter</strong> để xác nhận nhanh.
                        </Form.Text>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={loading}>
                    Đóng
                </Button>
                <Button
                    variant={isCancelAction ? 'danger' : 'primary'}
                    onClick={handleConfirm}
                    disabled={loading}
                >
                    {loading ? 'Đang xử lý...' : (isCancelAction ? 'Xác nhận Hủy' : 'Cập nhật')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

StatusModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    status: PropTypes.string,
    statusLabel: PropTypes.string,
    loading: PropTypes.bool,
    title: PropTypes.string
};

export default StatusModal;
