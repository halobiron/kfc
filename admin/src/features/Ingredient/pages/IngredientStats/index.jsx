import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiTrendingUp, FiFilter, FiArrowLeft } from 'react-icons/fi';
import { getIngredientUsageStats } from '../../ingredientStatsSlice';
import StatCard from '../../../../components/Common/StatCard';
import Button from '../../../../components/Common/Button';
import Loading from '../../../../components/Common/Loading';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import ingredientApi from '../../../../api/ingredientApi';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const TIME_RANGES = [
    { value: 'week', label: 'Tuần' },
    { value: 'month', label: 'Tháng' },
    { value: 'year', label: 'Năm' }
];

const CHART_COLORS = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)'
];

const FILTER_MODES = {
    ingredient: {
        label: 'Theo nguyên liệu',
        icon: FiPackage,
        placeholder: '-- Tất cả nguyên liệu --',
        getLabel: (ing) => `${ing.name} (${ing.unit})`,
        getValue: (ing) => ing._id,
                getFeedback: (ing, ingredients) => `Đang xem: ${ingredients.find(i => i._id === ing)?.name}`
    },
    unit: {
        label: 'Theo đơn vị tính',
        icon: FiTrendingUp,
        placeholder: '-- Tất cả đơn vị --',
        getLabel: (unit) => unit,
        getValue: (unit) => unit,
        getFeedback: (unit) => `Đang xem tất cả nguyên liệu tính bằng ${unit}`
    }
};

const IngredientStats = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { stats, loading } = useSelector((state) => state.ingredientStats);
    const [dateRange, setDateRange] = useState('month');
    const [filterMode, setFilterMode] = useState('ingredient');
    const [selectedValue, setSelectedValue] = useState('');
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        const fetchFilters = async () => {
            const data = await ingredientApi.getAll();
            if (data.status) setIngredients(data.data);
        };
        fetchFilters();
    }, []);

    useEffect(() => {
        const params = { range: dateRange };
        if (selectedValue) {
            params[filterMode === 'ingredient' ? 'ingredientId' : 'unit'] = selectedValue;
        }
        dispatch(getIngredientUsageStats(params));
    }, [dispatch, dateRange, filterMode, selectedValue]);

    const handleModeChange = (mode) => {
        setFilterMode(mode);
        setSelectedValue('');
    };

    const barChartData = useMemo(() => ({
        labels: stats.topIngredients?.map(i => `${i.name} (${i.totalQuantity}${i.unit})`) || [],
        datasets: [{
            label: 'Lượng sử dụng',
            data: stats.topIngredients?.map(i => i.totalQuantity) || [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    }), [stats.topIngredients]);

    const unitChartData = useMemo(() => ({
        labels: stats.unitUsage?.map(u => u._id) || [],
        datasets: [{
            data: stats.unitUsage?.map(u => u.totalQuantity) || [],
            backgroundColor: CHART_COLORS
        }]
    }), [stats.unitUsage]);

    const currentMode = FILTER_MODES[filterMode];
    const Icon = currentMode.icon;
    const options = filterMode === 'ingredient'
        ? ingredients
        : (stats.availableUnits || []);

    const getStatCardContent = () => {
        if (filterMode === 'ingredient' && stats.selectedIngredient) {
            return (
                <StatCard
                    label={`Lượng dùng (${stats.selectedIngredient.name})`}
                    value={`${stats.totalQuantity} ${stats.selectedIngredient.unit}`}
                    icon={<FiPackage size={24} />}
                    color="primary"
                />
            );
        }
        if (filterMode === 'unit' && selectedValue) {
            return (
                <StatCard
                    label={`Tổng lượng (${selectedValue})`}
                    value={`${stats.totalQuantity} ${selectedValue}`}
                    icon={<FiPackage size={24} />}
                    color="primary"
                />
            );
        }
        return (
            <div className="card">
                <div className="card-body text-center text-muted p-0">
                    <FiPackage size={24} className="mb-1" />
                    <p className="mb-0 small">
                        {filterMode === 'ingredient'
                            ? 'Chọn nguyên liệu để xem thống kê chi tiết'
                            : 'Chọn đơn vị tính để xem tổng lượng'}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="page-header d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-3">
                    <Button variant="outline-secondary" onClick={() => navigate('/ingredients')}>
                        <FiArrowLeft />
                    </Button>
                    <h1 className="page-title mb-0">Thống kê Nguyên liệu</h1>
                </div>
                <div className="btn-group border rounded">
                    {TIME_RANGES.map((range) => (
                        <Button
                            key={range.value}
                            size="sm"
                            variant={dateRange === range.value ? 'primary' : 'light'}
                            onClick={() => setDateRange(range.value)}
                        >
                            {range.label}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="d-flex gap-2 mb-3">
                        {Object.entries(FILTER_MODES).map(([key, mode]) => (
                            <button
                                key={key}
                                className={`btn ${filterMode === key ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => handleModeChange(key)}
                            >
                                {mode.label}
                            </button>
                        ))}
                    </div>

                    <div className="row g-3">
                        <div className="col-md-10">
                            <label className="form-label fw-semibold">
                                <Icon className="me-2" />
                                Chọn {currentMode.label.toLowerCase()}
                            </label>
                            <select
                                className="form-select form-select-lg"
                                value={selectedValue}
                                onChange={(e) => setSelectedValue(e.target.value)}
                            >
                                <option value="">{currentMode.placeholder}</option>
                                {options.map((item) => (
                                    <option key={currentMode.getValue(item)} value={currentMode.getValue(item)}>
                                        {currentMode.getLabel(item)}
                                    </option>
                                ))}
                            </select>
                            {selectedValue && (
                                <small className="text-muted mt-1 d-block">
                                    {currentMode.getFeedback(selectedValue, ingredients)}
                                </small>
                            )}
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <Button
                                variant="outline-secondary"
                                className="w-100"
                                onClick={() => setSelectedValue('')}
                            >
                                <FiFilter /> Reset
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <Loading center text="Đang tải thống kê..." />
            ) : (
                <>
                    <div className="row mb-4 g-4">
                        <div className="col-md-6">{getStatCardContent()}</div>
                        <div className="col-md-6">
                            <StatCard
                                label="Số lần trừ kho"
                                value={stats.totalDeductions}
                                icon={<FiTrendingUp size={24} />}
                                color="success"
                            />
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="card h-100">
                                <div className="card-header">
                                    <h5 className="mb-0">Top nguyên liệu dùng nhiều</h5>
                                </div>
                                <div className="card-body">
                                    <div style={{ height: '300px' }}>
                                        <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card h-100">
                                <div className="card-header">
                                    <h5 className="mb-0">Theo đơn vị tính</h5>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                                        <Doughnut data={unitChartData} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default IngredientStats;
