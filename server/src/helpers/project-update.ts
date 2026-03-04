export const getProjectUpdateHelper = (name: string, status: string) => {
  const descriptionList = {
    'in-progress': `Your project: ${name} is approved and is in progress`,
    completed: `Your project: ${name} has been completed successfully.`,
    'on-hold': `Your project: ${name} is currently on hold.`,
    cancelled: `Your project: ${name} has been cancelled.`,
    'note-added': `A new note has been added to your project: ${name}.`,
    'payment-completed': `Payment for your project: ${name} has been completed successfully.`,
    pending: `A new project: ${name} has been created and is pending approval.`,
    'update-pending': `Project: ${name} has been updated and is pending review.`,
  };

  return descriptionList[status as keyof typeof descriptionList];
};
