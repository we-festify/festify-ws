export const extractVariableNames = (text: string) => {
  const regex = /{{(.*?)}}/g;
  const matches = text.match(regex);
  if (!matches) {
    return [];
  }

  const variableNames = matches.map((match) => match.replace(/{{|}}/g, ''));
  return [...new Set(variableNames)];
};

export const replaceVariables = (
  text: string,
  variables: Record<string, unknown>,
) => {
  return text.replace(/{{(.*?)}}/g, (_, match) => {
    return variables[match] as string;
  });
};