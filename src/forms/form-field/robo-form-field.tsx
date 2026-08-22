'use client';

import * as React from 'react';
import {
  useFormContext,
  Controller,
  FormProvider,
  type FieldValues,
  type FieldPath,
  type ControllerProps,
  type UseFormReturn,
} from 'react-hook-form';

import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Context                                                               */
/* ------------------------------------------------------------------ */

interface FormFieldContextValue {
  name: string;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

function useFormField() {
  const ctx = React.use(FormFieldContext);
  if (!ctx) throw new Error('useFormField must be used inside RoboFormField');
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(ctx.name, formState);
  return { name: ctx.name, ...fieldState };
}

/* ------------------------------------------------------------------ */
/* RoboFormField                                                          */
/* ------------------------------------------------------------------ */

export interface RoboFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'> {
  /** Visible label for the field */
  label?: string;
  /** Helper text shown below the field */
  helperText?: string;
  /** Mark field as required (visual indicator only — validation via schema/rules) */
  required?: boolean;
  /**
   * Render function — receives the Controller field props plus the current error message.
   * Use this to render any Robo form input.
   */
  children: (props: {
    field: Parameters<ControllerProps<TFieldValues, TName>['render']>[0]['field'];
    error?: string;
    id: string;
  }) => React.ReactNode;
  /** Additional wrapper class */
  className?: string;
}

/**
 * RoboFormField — react-hook-form Controller wrapper.
 *
 * Connects any Robo form input to react-hook-form context.
 * Automatically passes error messages and ids.
 *
 * @example
 * ```tsx
 * <RoboFormField name="email" label="Email" required>
 *   {({ field, error, id }) => (
 *     <RoboInput id={id} {...field} error={error} />
 *   )}
 * </RoboFormField>
 * ```
 */
function RoboFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  helperText,
  required,
  children,
  className,
  ...controllerProps
}: RoboFormFieldProps<TFieldValues, TName>) {
  const fieldId = React.useId();
  const helperId = `${fieldId}-helper`;

  return (
    <FormFieldContext value={{ name }}>
      <Controller
        name={name}
        {...controllerProps}
        render={({ field, fieldState }) => {
          const errorMessage = fieldState.error?.message;

          return (
            <div className={cn('flex flex-col gap-1.5', className)}>
              {label && (
                <label
                  htmlFor={fieldId}
                  className='text-sm font-medium text-[var(--foreground)]'
                >
                  {label}
                  {required && (
                    <span className='ml-1 text-[var(--destructive)]' aria-hidden='true'>
                      *
                    </span>
                  )}
                </label>
              )}

              {children({ field, error: errorMessage, id: fieldId })}

              {errorMessage ? (
                <p
                  id={`${fieldId}-error`}
                  role='alert'
                  className='text-xs text-[var(--destructive)]'
                >
                  {errorMessage}
                </p>
              ) : helperText ? (
                <p id={helperId} className='text-xs text-[var(--muted-foreground)]'>
                  {helperText}
                </p>
              ) : null}
            </div>
          );
        }}
      />
    </FormFieldContext>
  );
}
RoboFormField.displayName = 'RoboFormField';

/* ------------------------------------------------------------------ */
/* RoboForm — wraps FormProvider + <form>                                 */
/* ------------------------------------------------------------------ */

export interface RoboFormProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** react-hook-form methods from useForm() */
  form: UseFormReturn<TFieldValues>;
  /** Form submit handler — receives validated values */
  onSubmit: (values: TFieldValues) => void | Promise<void>;
}

/**
 * RoboForm — Wraps react-hook-form's FormProvider with a styled `<form>` element.
 *
 * @example
 * ```tsx
 * const form = useForm<Schema>({ resolver: zodResolver(schema) });
 *
 * <RoboForm form={form} onSubmit={handleSubmit}>
 *   <RoboFormField name="name" label="Name" required>
 *     {({ field, error, id }) => <RoboInput id={id} {...field} error={error} />}
 *   </RoboFormField>
 *   <RoboFormSubmit>Submit</RoboFormSubmit>
 * </RoboForm>
 * ```
 */
function RoboForm<TFieldValues extends FieldValues = FieldValues>({
  form,
  onSubmit,
  children,
  className,
  ...formProps
}: RoboFormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-4', className)}
        noValidate
        {...formProps}
      >
        {children}
      </form>
    </FormProvider>
  );
}
RoboForm.displayName = 'RoboForm';

/* ------------------------------------------------------------------ */
/* RoboFormSubmit — submit button                                         */
/* ------------------------------------------------------------------ */

export interface RoboFormSubmitProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Show loading state (disables and shows spinner) */
  loading?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * RoboFormSubmit — Submit button for RoboForm.
 *
 * Automatically disabled while the form is submitting.
 */
function RoboFormSubmit({ children = 'Submit', loading, disabled, className, ref, ...props }: RoboFormSubmitProps) {
    const { formState } = useFormContext();
    const isSubmitting = formState.isSubmitting || loading;

    return (
      <button
        ref={ref}
        type='submit'
        disabled={disabled || isSubmitting}
        aria-busy={isSubmitting}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-[var(--radius)]',
          'bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)]',
          'transition-colors duration-[var(--duration-fast)]',
          'hover:bg-[var(--primary-hover)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        {isSubmitting && (
          <svg
            className='h-4 w-4 animate-spin'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            aria-hidden='true'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
            />
          </svg>
        )}
        {children}
      </button>
    );
}
RoboFormSubmit.displayName = 'RoboFormSubmit';

export { RoboFormField, RoboForm, RoboFormSubmit, useFormField };
