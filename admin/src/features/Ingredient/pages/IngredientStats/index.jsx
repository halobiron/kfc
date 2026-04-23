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
    }
};

const IngredientStats = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { stats, loading } = useSelector((state) => state.ingredientStats);
    const [dateRange, setDateRange] = useState('month');
    const [filterMode] = useState('ingredient');
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
            params.ingredientId = selectedValue;
        }
        dispatch(getIngredientUsageStats(params));
    }, [dispatch, dateRange, selectedValue]);

    const handleModeChange = (mode) => {
        // No-op since we only have one mode now, but keeping the signature for safety
        setSelectedValue('');
    };

    const barChartData = useMemo(() => ({
        labels: stats.topIngredients?.map(i => `${i.name} (${Number(i.totalQuantity).toFixed(2)}${i.unit})`) || [],
        datasets: [{
            label: 'Lượng sử dụng',
            data: stats.topIngredients?.map(i => Number(i.totalQuantity).toFixed(2)) || [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    }), [stats.topIngredients]);

    const currentMode = FILTER_MODES[filterMode];
    const Icon = currentMode.icon;
    const options = ingredients;

    const getStatCardContent = () => {
        if (stats.selectedIngredient) {
            return (
                <StatCard
                    label={`Lượng dùng (${stats.selectedIngredient.name})`}
                    value={`${Number(stats.totalQuantity).toFixed(2)} ${stats.selectedIngredient.unit}`}
                    icon={<FiPackage size={24} />}
                    color="primary"
                />
            );
        }
        return (
            <div className="card">
                <div className="card-body text-center text-muted p-0 py-2">
                    <FiPackage size={20} className="mb-1" />
                    <p className="mb-0 small">
                        Chọn nguyên liệu để xem thống kê chi tiết
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

            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-10">
                            <label className="form-label fw-bold">
                                <Icon className="me-2 text-primary" />
                                Chọn nguyên liệu
                            </label>
                            <select
                                className="form-select form-select-lg"
                                value={selectedValue}
                                onChange={(e) => setSelectedValue(e.target.value)}
                            >
                                <option value="">{currentMode.placeholder}</option>
                                {options.map((item) => (
                                    <option key={item._id} value={item._id}>
                                        {`${item.name} (${item.unit})`}
                                    </option>
                                ))}
                            </select>
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
                        <div className="col-lg-12">
                            <div className="card h-100">
                                <div className="card-header bg-white">
                                    <h5 className="mb-0">Top 10 nguyên liệu sử dụng nhiều nhất</h5>
                                </div>
                                <div className="card-body">
                                    <div style={{ height: '400px' }}>
                                        <Bar 
                                            data={barChartData} 
                                            options={{ 
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: { display: false }
                                                }
                                            }} 
                                        />
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
