import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/data/dto/analytics_dto.dart';
import '../../../../core/presentation/theme/app_colors.dart';
import '../../../../core/presentation/theme/app_text_styles.dart';
import '../../../../core/presentation/widgets/core_widgets.dart';
import '../../application/merchant_analytics_controller.dart';

class MerchantAnalyticsPage extends ConsumerStatefulWidget {
  const MerchantAnalyticsPage({super.key});

  @override
  ConsumerState<MerchantAnalyticsPage> createState() =>
      _MerchantAnalyticsPageState();
}

class _MerchantAnalyticsPageState
    extends ConsumerState<MerchantAnalyticsPage> {
  late DateTime _from;
  late DateTime _to;

  @override
  void initState() {
    super.initState();
    _to = DateTime.now();
    _from = _to.subtract(const Duration(days: 30));
  }

  Future<void> _pickFrom() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _from,
      firstDate: DateTime(2020),
      lastDate: _to,
    );
    if (picked != null && picked != _from) {
      setState(() => _from = picked);
      ref
          .read(merchantAnalyticsControllerProvider.notifier)
          .fetchRange(_from, _to);
    }
  }

  Future<void> _pickTo() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _to,
      firstDate: _from,
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _to) {
      setState(() => _to = picked);
      ref
          .read(merchantAnalyticsControllerProvider.notifier)
          .fetchRange(_from, _to);
    }
  }

  @override
  Widget build(BuildContext context) {
    final analyticsAsync = ref.watch(merchantAnalyticsControllerProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Analytics')),
      body: Column(
        children: [
          // Date range picker row
          Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                const Icon(Icons.date_range,
                    size: 18, color: AppColors.textSecondary),
                const SizedBox(width: 8),
                TextButton(
                  onPressed: _pickFrom,
                  child: Text(_fmtDate(_from)),
                ),
                const Text('→',
                    style: TextStyle(color: AppColors.textSecondary)),
                TextButton(
                  onPressed: _pickTo,
                  child: Text(_fmtDate(_to)),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: analyticsAsync.when(
              loading: () => const Center(
                child: CircularProgressIndicator(color: AppColors.primary),
              ),
              error: (e, _) => Padding(
                padding: const EdgeInsets.all(16),
                child: ErrorBanner(
                  message: e.toString(),
                  onRetry: () => ref
                      .read(merchantAnalyticsControllerProvider.notifier)
                      .fetchRange(_from, _to),
                ),
              ),
              data: (summary) => _AnalyticsBody(summary: summary),
            ),
          ),
        ],
      ),
    );
  }

  String _fmtDate(DateTime d) =>
      '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';
}

class _AnalyticsBody extends StatelessWidget {
  final AnalyticsSummaryDto summary;
  const _AnalyticsBody({required this.summary});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Summary cards row
        Row(
          children: [
            Expanded(
              child: _SummaryCard(
                label: 'Total Volume',
                child: MoneyText(
                  amount: summary.totalVolume,
                  currency: summary.currency,
                  size: MoneySize.small,
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _SummaryCard(
                label: 'Success',
                child: Text(
                  '${summary.successCount}',
                  style: AppTextStyles.titleLarge
                      .copyWith(color: AppColors.success),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _SummaryCard(
                label: 'Failed',
                child: Text(
                  '${summary.failCount}',
                  style: AppTextStyles.titleLarge
                      .copyWith(color: AppColors.error),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),

        if (summary.dailySeries.isNotEmpty) ...[
          Text('Daily Volume', style: AppTextStyles.titleMedium),
          const SizedBox(height: 12),
          SizedBox(
            height: 220,
            child: _VolumeChart(series: summary.dailySeries),
          ),
        ] else
          const EmptyStateWidget(
            icon: Icons.bar_chart,
            title: 'No data for this period',
          ),
      ],
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final String label;
  final Widget child;
  const _SummaryCard({required this.label, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.divider),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: AppTextStyles.bodySmall),
          const SizedBox(height: 6),
          child,
        ],
      ),
    );
  }
}

class _VolumeChart extends StatelessWidget {
  final List<DailyVolumeDto> series;
  const _VolumeChart({required this.series});

  @override
  Widget build(BuildContext context) {
    final spots = series.asMap().entries.map((e) {
      final vol = double.tryParse(e.value.volume) ?? 0.0;
      return FlSpot(e.key.toDouble(), vol);
    }).toList();

    final maxY = spots.isEmpty
        ? 1.0
        : spots.map((s) => s.y).reduce((a, b) => a > b ? a : b) * 1.2;

    return LineChart(
      LineChartData(
        minY: 0,
        maxY: maxY > 0 ? maxY : 1,
        gridData: const FlGridData(show: true),
        borderData: FlBorderData(show: false),
        titlesData: FlTitlesData(
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 48,
              getTitlesWidget: (value, meta) => Text(
                _fmtAmount(value),
                style: AppTextStyles.bodySmall
                    .copyWith(fontSize: 9),
              ),
            ),
          ),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 28,
              interval: (series.length / 5).ceilToDouble().clamp(1, double.infinity),
              getTitlesWidget: (value, meta) {
                final idx = value.toInt();
                if (idx < 0 || idx >= series.length) {
                  return const SizedBox.shrink();
                }
                final date = series[idx].date;
                final parts = date.split('-');
                final label = parts.length >= 3
                    ? '${parts[2]}/${parts[1]}'
                    : date;
                return Text(label,
                    style: AppTextStyles.bodySmall.copyWith(fontSize: 9));
              },
            ),
          ),
          topTitles:
              const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles:
              const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        ),
        lineBarsData: [
          LineChartBarData(
            spots: spots,
            isCurved: true,
            color: AppColors.primary,
            barWidth: 2.5,
            dotData: const FlDotData(show: false),
            belowBarData: BarAreaData(
              show: true,
              color: AppColors.primary.withValues(alpha: 0.1),
            ),
          ),
        ],
        lineTouchData: LineTouchData(
          touchTooltipData: LineTouchTooltipData(
            getTooltipItems: (spots) => spots.map((s) {
              final idx = s.x.toInt();
              final date =
                  idx < series.length ? series[idx].date : '';
              return LineTooltipItem(
                '$date\n${_fmtAmount(s.y)}',
                AppTextStyles.labelMedium
                    .copyWith(color: AppColors.onPrimary),
              );
            }).toList(),
          ),
        ),
      ),
    );
  }

  String _fmtAmount(double v) {
    if (v >= 1000000) return '${(v / 1000000).toStringAsFixed(1)}M';
    if (v >= 1000) return '${(v / 1000).toStringAsFixed(1)}K';
    return v.toStringAsFixed(0);
  }
}
