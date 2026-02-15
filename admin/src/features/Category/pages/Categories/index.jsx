import React, { useState, useEffect } from 'react';
import { FiPlus, FiTag } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories, addCategory, updateCategory, deleteCategory } from '../../categorySlice';
import StatCard from '../../../../components/Common/StatCard';
import { CheckboxField, TextField } from '../../../../components/Common/Form';
import { AddButton, EditButton, DeleteButton } from '../../../../components/Common/Button';
import Badge from '../../../../components/Common/Badge';
import Table from '../../../../components/Common/Table';
import './Categories.css';

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector(state => state.categories);
  const { keyword } = useSelector(state => state.search);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    name: '',
    description: '',
    slug: '',
    icon: 'bi-tag',
    isActive: true
  });

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const filteredCategories = categories.filter(category => 
    (category.name && category.name.toLowerCase().includes((keyword || '').toLowerCase()))
  );

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditMode(true);
      setCurrentCategory(category);
    } else {
      setEditMode(false);
      setCurrentCategory({ name: '', description: '', slug: '', icon: 'bi-tag', isActive: true });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentCategory({ name: '', description: '', slug: '', icon: 'bi-tag', isActive: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await dispatch(updateCategory({ id: currentCategory._id, data: currentCategory })).unwrap();
        toast.success('Cập nhật danh mục thành công!');
      } else {
        await dispatch(addCategory(currentCategory)).unwrap();
        toast.success('Thêm danh mục thành công!');
      }
      handleCloseModal();
      dispatch(getAllCategories());
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        toast.success('Xóa danh mục thành công!');
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const handleToggleActive = async (category) => {
    try {
      await dispatch(updateCategory({
        id: category._id,
        data: { ...category, isActive: !category.isActive }
      })).unwrap();
      toast.success('Cập nhật trạng thái thành công!');
    } catch (error) {
      toast.error('Cập nhật trạng thái thất bại!');
    }
  };

  const columns = [
    {
      header: '#',
      className: 'ps-4',
      render: (_, index) => <span className="fw-bold">CAT{1000 + index + 1}</span>
    },
    {
      header: 'Tên danh mục',
      render: (category) => (
        <div className="d-flex align-items-center gap-2">
          <i className={`bi ${category.icon || 'bi-tag'} text-primary`}></i>
          <span className="fw-bold">{category.name}</span>
        </div>
      )
    },
    {
      header: 'Mô tả',
      className: 'text-muted',
      key: 'description'
    },
    {
      header: 'Số sản phẩm',
      className: 'text-center',
      render: (category) => <Badge variant="light">{category.productCount || 0} món</Badge>
    },
    {
      header: 'Trạng thái',
      className: 'text-center',
      render: (category) => (
        <div className="form-check form-switch categories-switch-wrap d-flex justify-content-center">
          <input
            className="form-check-input"
            type="checkbox"
            checked={category.isActive}
            onChange={() => handleToggleActive(category)}
          />
        </div>
      )
    },
    {
      header: 'Thao tác',
      className: 'text-end pe-4',
      render: (category) => (
        <>
          <EditButton onClick={() => handleOpenModal(category)} className="me-2" />
          <DeleteButton onClick={() => handleDelete(category._id)} />
        </>
      )
    }
  ];

  return (
    <>
      <>
        <div className="categories-page-header">
          <h1 className="page-title">Quản lý Danh mục Sản phẩm</h1>
          <AddButton
            onClick={() => handleOpenModal()}
          />
        </div>

        {/* Stats Overview */}
        <div className="row mb-4 g-3">
          <div className="col-md-4">
            <StatCard
              label="Tổng danh mục"
              value={categories.length}
              icon={<FiTag size={24} />}
              color="primary"
            />
          </div>
          <div className="col-md-4">
            <StatCard
              label="Đang hoạt động"
              value={categories.filter(cat => cat.isActive).length}
              icon={<FiTag size={24} />}
              color="success"
            />
          </div>
          <div className="col-md-4">
            <StatCard
              label="Tổng sản phẩm"
              value={categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0)}
              icon={<FiTag size={24} />}
              color="info"
            />
          </div>
        </div>

        {/* Categories Table */}
        <div className="card">
          <div className="card-header">Danh sách danh mục</div>
          <Table 
            columns={columns}
            data={filteredCategories}
            loading={loading}
            emptyMessage="Không tìm thấy danh mục nào"
          />
        </div>
      </>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block categories-modal-backdrop" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <TextField
                    name="name"
                    label="Tên danh mục"
                    required
                    value={currentCategory.name}
                    onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                    placeholder="VD: Gà rán, Burger..."
                  />
                  <TextField
                    name="slug"
                    label="Slug (URL)"
                    value={currentCategory.slug}
                    onChange={(e) => setCurrentCategory({ ...currentCategory, slug: e.target.value })}
                    placeholder="VD: ga-ran, burger..."
                    hint="Để trống sẽ tự động tạo từ tên danh mục"
                  />
                  <TextField
                    as="textarea"
                    name="description"
                    label="Mô tả"
                    rows="3"
                    value={currentCategory.description}
                    onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                    placeholder="Mô tả ngắn về danh mục này..."
                  />
                  <div className="mb-3">
                    <label className="form-label">Biểu tượng (Bootstrap Icon class)</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        name="icon"
                        value={currentCategory.icon}
                        onChange={(e) => setCurrentCategory({ ...currentCategory, icon: e.target.value })}
                        placeholder="VD: bi-tag, bi-cup-hot..."
                      />
                      <span className="input-group-text icon-preview-box" title="Preview">
                        <i className={`bi ${currentCategory.icon} fs-5`}></i>
                      </span>
                    </div>
                    <div className="form-text mt-1">
                      Tra cứu thêm tại <a href="https://icons.getbootstrap.com/" target="_blank" rel="noreferrer" className="text-decoration-none">Bootstrap Icons</a>
                    </div>
                  </div>
                  <CheckboxField
                    id="isActiveCheck"
                    checked={currentCategory.isActive}
                    onChange={(e) => setCurrentCategory({ ...currentCategory, isActive: e.target.checked })}
                    label="Kích hoạt danh mục này"
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Categories;
