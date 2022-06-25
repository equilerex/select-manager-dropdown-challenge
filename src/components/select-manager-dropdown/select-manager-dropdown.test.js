import { render, screen } from "@testing-library/react";
import SelectManagerDropdown, {
  exportedForTesting,
} from "./select-manager-dropdown";

const employeesMock = {
  data: [
    {
      id: "323",
      attributes: {
        firstName: "Harriet",
        lastName: "McKinney",
        name: "Harriet McKinney",
      },
      relationships: {
        account: {
          data: {
            id: "324",
          },
        },
      },
    },
    {
      id: "139",
      attributes: {
        firstName: "Harriet",
        lastName: "Banks",
        name: "Harriet Banks",
      },
      relationships: {
        account: {
          data: {
            id: "140",
          },
        },
      },
    },
  ],
  included: [
    {
      id: "140",
      attributes: {
        email: "harriet.banks@kinetar.com",
      },
    },
    {
      id: "324",
      attributes: {
        email: "harriet.mckinney@kinetar.com",
      },
    },
  ],
};
//  ************* function tests *******************
describe("initials", () => {
  const { initials } = exportedForTesting;
  it("Should return first letter from first and last names", () => {
    expect(initials({ firstName: "abc", lastName: "def" }, "abc def")).toBe(
      "ad"
    );
  });
  it("Should handle missing names", () => {
    expect(initials({ firstName: "abc", lastName: null }, "abc def")).toBe("a");
    expect(initials({}, "abc def")).toBe("");
  });
});

describe("filterManagersBySearch", () => {
  const { filterManagersBySearch } = exportedForTesting;
  const managers = [
    { firstName: "aaa" },
    { firstName: "bbb" },
    { firstName: "ab" },
  ];
  it("Should filter out non-matching", () => {
    expect(filterManagersBySearch(managers, "aa").length).toBe(1);
  });
  it("Should return multiple matches", () => {
    expect(filterManagersBySearch(managers, "a").length).toBe(2);
  });
  it("Should return empty array when no match", () => {
    expect(filterManagersBySearch(managers, "x").length).toBe(0);
  });
});

describe("checkFullNameMatch", () => {
  const { checkFullNameMatch } = exportedForTesting;
  const testManager = { firstName: "abc", lastName: "def" };
  it("Should return ignore spaces", () => {
    expect(checkFullNameMatch(testManager, "abc def")).toBe(true);
    expect(checkFullNameMatch(testManager, "abcdef")).toBe(true);
  });
  it("Should return true on partial match", () => {
    expect(checkFullNameMatch(testManager, "cd")).toBe(true);
  });
  it("Should be agnostic to name order", () => {
    expect(checkFullNameMatch(testManager, "def abc")).toBe(true);
  });
  it("Should return false when string doesnt match", () => {
    expect(checkFullNameMatch(testManager, "abnot")).toBe(false);
  });
  it("Should handle missing values", () => {
    expect(checkFullNameMatch({ ...testManager, lastName: null }, "ab")).toBe(
      true
    );
  });
  it("Should return true if no search string", () => {
    expect(checkFullNameMatch(testManager, "")).toBe(true);
  });
  it("Should return false if no name", () => {
    expect(checkFullNameMatch({}, "ss")).toBe(false);
  });
});

// ****************** component tests *******************
describe("(Component) SelectManagerDropdown", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue(employeesMock),
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Should render input", () => {
    render(<SelectManagerDropdown />);
    const input = screen.getByPlaceholderText("Choose Manager");
    expect(input).toBeInTheDocument();
  });

  // todo: should have more cases for the keyboard nav, selection, etc...
  //  for now, i'm lacking some react specific knowledge for the moment for handling async dom changes... and i do not have enough time this/next week to dive into that.
});
