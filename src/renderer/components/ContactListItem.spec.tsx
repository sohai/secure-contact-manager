import { render, fireEvent, screen } from "@testing-library/react";
import * as React from "react";
import "@testing-library/jest-dom/extend-expect";
import { v4 as uuid } from "uuid";
import ContactListItem from "./ContactListItem";
import * as faker from "faker";

test("just an simple example of test", async () => {
  const contact = {
    uuid: uuid(),
    name: faker.name.firstName() + " " + faker.name.lastName(),
    address: faker.address.city() + " " + faker.address.streetAddress(),
    phone: faker.phone.phoneNumber(),
    email: faker.internet.email(),
  };
  const onEdit = jest.fn();
  const onDelete = jest.fn();
  render(
    <ContactListItem contact={contact} onEdit={onEdit} onDelete={onDelete} />
  );

  expect(screen.getByText(contact.name)).toBeDefined();

  fireEvent.click(screen.getByLabelText("more"));
  expect(screen.getByText(contact.phone)).toBeDefined();

  fireEvent.click(screen.getByLabelText("edit"));

  expect(onEdit).toHaveBeenCalled();
});
