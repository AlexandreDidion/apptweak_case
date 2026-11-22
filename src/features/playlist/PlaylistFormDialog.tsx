import { useForm } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  emptyPlaylistFormValues,
  playlistFormSchema,
  PlaylistFormValues
} from "./playlistFormSchema";

const FORM_ID = "playlist-form";

interface PlaylistFormProps {
  /** Empty values to create, the playlist's current values to edit */
  defaultValues?: PlaylistFormValues;
  submitLabel: string;
  onSubmit: (values: PlaylistFormValues) => void;
  isSubmitting?: boolean;
  submitError?: string;
}

interface PlaylistFormDialogProps extends PlaylistFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
}

export function PlaylistFormDialog({
  open,
  onOpenChange,
  title,
  description,
  ...formProps
}: PlaylistFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <PlaylistForm {...formProps} />
      </DialogContent>
    </Dialog>
  );
}

function PlaylistForm({
  defaultValues = emptyPlaylistFormValues,
  submitLabel,
  onSubmit,
  isSubmitting = false,
  submitError
}: PlaylistFormProps) {
  const form = useForm({
    defaultValues,
    validators: { onSubmit: playlistFormSchema },
    onSubmit: ({ value }) => {
      onSubmit(value);
    }
  });

  return (
    <>
      <form
        id={FORM_ID}
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="name">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Name
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      field.handleChange(event.target.value);
                    }}
                    aria-invalid={isInvalid}
                    aria-required="true"
                    placeholder="My road trip mix"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="description">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      field.handleChange(event.target.value);
                    }}
                    aria-invalid={isInvalid}
                    placeholder="Songs for the long drives"
                    className="min-h-24 resize-none"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="isPublic">
            {(field) => (
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Public</FieldLabel>
                  <FieldDescription>
                    {field.state.value
                      ? "Anyone can see this playlist on your profile."
                      : "Only you can see this playlist."}
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => {
                    field.handleChange(checked);
                  }}
                />
              </Field>
            )}
          </form.Field>
        </FieldGroup>
        {submitError && <FieldError className="mt-4">{submitError}</FieldError>}
      </form>

      <DialogFooter>
        <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
        {/* Outside the <form>, linked through its id */}
        <Button type="submit" form={FORM_ID} isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </>
  );
}
