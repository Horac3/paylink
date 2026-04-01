import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import '../dto/auth_dto.dart';
import '../dto/link_dto.dart';
import '../dto/transaction_dto.dart';
import '../dto/analytics_dto.dart';
import '../dto/subscription_dto.dart';

part 'paylink_api.g.dart';

@RestApi()
abstract class PaylinkApi {
  factory PaylinkApi(Dio dio, {String baseUrl}) = _PaylinkApi;

  // ── Merchant Auth ──────────────────────────────────────────────────────
  @POST('/auth/register')
  Future<AuthResponseDto> merchantRegister(
      @Body() MerchantRegisterRequestDto body);

  @POST('/auth/login')
  Future<AuthResponseDto> merchantLogin(@Body() MerchantLoginRequestDto body);

  @POST('/auth/refresh')
  Future<AuthResponseDto> refreshToken(@Body() RefreshTokenRequestDto body);

  // ── Payer Auth ─────────────────────────────────────────────────────────
  @POST('/payer-auth/register')
  Future<void> payerRegister(@Body() PayerRegisterRequestDto body);

  @POST('/payer-auth/verify-otp')
  Future<PayerAuthResponseDto> payerVerifyOtp(
      @Body() PayerVerifyOtpRequestDto body);

  // ── Links ──────────────────────────────────────────────────────────────
  @GET('/links')
  Future<PagedResponseDto<PaymentLinkDto>> getLinks(
    @Query('page') int page,
    @Query('limit') int limit,
  );

  @POST('/links')
  Future<PaymentLinkDto> createLink(@Body() CreateLinkRequestDto body);

  @GET('/links/{id}')
  Future<LinkDetailDto> getLinkDetail(@Path('id') String id);

  @PATCH('/links/{id}/archive')
  Future<void> archiveLink(@Path('id') String id);

  @POST('/links/bulk-send')
  Future<void> bulkSend(@Body() BulkSendRequestDto body);

  // ── Transactions ───────────────────────────────────────────────────────
  @GET('/transactions')
  Future<PagedResponseDto<TransactionDto>> getTransactions(
    @Query('page') int page,
    @Query('limit') int limit,
    @Query('linkId') String? linkId,
  );

  @GET('/transactions/{id}')
  Future<TransactionDto> getTransactionDetail(@Path('id') String id);

  // ── Payments ───────────────────────────────────────────────────────────
  @POST('/payments/initiate')
  Future<InitiatePaymentResponseDto> initiatePayment(
      @Body() InitiatePaymentRequestDto body);

  @GET('/payments/{id}/status')
  Future<TransactionDto> getPaymentStatus(@Path('id') String id);

  // ── Refunds ────────────────────────────────────────────────────────────
  @POST('/refunds')
  Future<void> requestRefund(@Body() RefundRequestDto body);

  // ── Analytics ─────────────────────────────────────────────────────────
  @GET('/analytics/summary')
  Future<AnalyticsSummaryDto> getAnalyticsSummary(
    @Query('from') String from,
    @Query('to') String to,
  );

  // ── Subscriptions ──────────────────────────────────────────────────────
  @GET('/subscriptions')
  Future<PagedResponseDto<SubscriptionDto>> getSubscriptions(
    @Query('page') int page,
    @Query('limit') int limit,
  );

  @PATCH('/subscriptions/{id}/cancel')
  Future<void> cancelSubscription(@Path('id') String id);
}
