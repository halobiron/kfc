import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

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

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form submission refresh
        onConfirm(note);
    };

    const handleKeyDown = (e) => {
        // Submit on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onConfirm(note);
        }
    };

    const isCancelAction = status === 'cancelled';
    const displayStatusLabel = statusLabel || status;

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className={isCancelAction ? 'bg-danger text-white' : ''}>
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
                    onClick={() => onConfirm(note)}
                    disabled={loading}
                >
                    {loading ? 'Đang xử lý...' : (isCancelAction ? 'Xác nhận Hủy' : 'Cập nhật')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default StatusModal;
