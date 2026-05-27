<?php

namespace App\Exceptions;

use App\Traits\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

/**
 * Centralized exception handler for the Humanova API.
 *
 * Ensures all API errors return a standardized JSON format:
 * { "success": false, "message": "...", "errors": {} }
 */
class Handler extends ExceptionHandler
{
    use ApiResponse;

    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        AuthenticationException::class,
        AuthorizationException::class,
        ValidationException::class,
        ModelNotFoundException::class,
        ThrottleRequestsException::class,
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            // Log security-sensitive exceptions
            if ($e instanceof AuthenticationException || $e instanceof AuthorizationException) {
                Log::channel('stack')->warning('Security exception', [
                    'type'       => get_class($e),
                    'message'    => $e->getMessage(),
                    'ip'         => request()?->ip(),
                    'url'        => request()?->fullUrl(),
                    'user_agent' => request()?->userAgent(),
                    'user_id'    => auth()->id(),
                ]);
            }
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e): Response
    {
        // Only produce JSON for API requests
        if ($this->shouldReturnJson($request, $e)) {
            return $this->handleApiException($request, $e);
        }

        return parent::render($request, $e);
    }

    /**
     * Handle all API exceptions with standardized JSON responses.
     */
    protected function handleApiException(Request $request, Throwable $e): JsonResponse
    {
        return match (true) {
            $e instanceof ValidationException => $this->handleValidationException($e),
            $e instanceof AuthenticationException => $this->unauthorized('Unauthenticated. Please log in.'),
            $e instanceof AuthorizationException => $this->forbidden($e->getMessage() ?: 'You do not have permission to perform this action.'),
            $e instanceof ModelNotFoundException => $this->handleModelNotFound($e),
            $e instanceof NotFoundHttpException => $this->notFound('The requested endpoint does not exist.'),
            $e instanceof MethodNotAllowedHttpException => $this->error(
                'The HTTP method is not allowed for this endpoint.',
                Response::HTTP_METHOD_NOT_ALLOWED
            ),
            $e instanceof ThrottleRequestsException => $this->tooManyRequests(
                'Rate limit exceeded. Please wait before making another request.'
            ),
            $e instanceof HttpException => $this->error(
                $e->getMessage() ?: 'An HTTP error occurred.',
                $e->getStatusCode()
            ),
            default => $this->handleGenericException($e),
        };
    }

    /**
     * Handle validation exceptions with field-level error details.
     */
    protected function handleValidationException(ValidationException $e): JsonResponse
    {
        return $this->validationError(
            $e->errors(),
            $e->getMessage() ?: 'The given data was invalid.'
        );
    }

    /**
     * Handle model-not-found with a friendly message.
     */
    protected function handleModelNotFound(ModelNotFoundException $e): JsonResponse
    {
        $model = class_basename($e->getModel());

        return $this->notFound("{$model} not found.");
    }

    /**
     * Handle generic/unexpected exceptions.
     * In debug mode, expose details; in production, hide them.
     */
    protected function handleGenericException(Throwable $e): JsonResponse
    {
        Log::error('Unhandled exception', [
            'exception' => get_class($e),
            'message'   => $e->getMessage(),
            'file'      => $e->getFile(),
            'line'      => $e->getLine(),
            'trace'     => $e->getTraceAsString(),
            'url'       => request()?->fullUrl(),
            'user_id'   => auth()->id(),
        ]);

        if (config('app.debug')) {
            return $this->error(
                $e->getMessage(),
                Response::HTTP_INTERNAL_SERVER_ERROR,
                [
                    'exception' => get_class($e),
                    'file'      => $e->getFile(),
                    'line'      => $e->getLine(),
                ]
            );
        }

        return $this->serverError('An unexpected error occurred. Please try again later.');
    }

    /**
     * Determine if the exception handler response should be JSON.
     */
    protected function shouldReturnJson($request, Throwable $e): bool
    {
        return $request->is('api/*') || $request->expectsJson();
    }

    /**
     * Convert an authentication exception into a JSON response.
     */
    protected function unauthenticated($request, AuthenticationException $exception): Response
    {
        if ($this->shouldReturnJson($request, $exception)) {
            return $this->unauthorized('Unauthenticated. Please log in.');
        }

        return redirect()->guest(route('login'));
    }
}
