export const contactFormSchema = {
  name(value: string) {
    if (!value) return "Name is required";
    if (value.length < 2) return "Name must be at least 2 characters long";
    if (value.length > 20) return "Name must be less than 20 characters long";
    return true;
  },
  email(value: string) {
    if (!value) {
      return "Email is required";
    }
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!regex.test(value)) {
      return "Email not valid";
    }
    return true;
  },
  date(value: string) {
    if (!value) return "Date is required";
    const date = new Date(value).getDay();

    if (date > 4) return "Date must be a weekday";

    return true;
  },
  time(value: string) {
    if (!value) return "Time is required";

    const time = toDate(value).toLocaleTimeString();
    function toDate(dStr: string) {
      var now = new Date();
      now.setHours(+dStr.substring(0, dStr.indexOf(":")));
      now.setMinutes(+dStr.substring(dStr.indexOf(":") + 1));
      now.setSeconds(0);
      return now;
    }

    if (time < "09:00:00") return "Time must be after 9:00 AM";
    if (time > "17:00:00") return "Time must be before 5:00 PM";
    return true;
  },
};
