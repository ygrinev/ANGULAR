using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace StaffTravel.BL
{
    public class FieldIdTranslator
    {
        private static Dictionary<CustomFieldsList, string> _CustomFieldDictByName;
        private static Dictionary<string, CustomFieldsList> _CustomFieldDictById;

        public static Dictionary<CustomFieldsList, string> CustomFieldDictByName
        {
            get
            {
                return _CustomFieldDictByName;
            }
        }

        public static Dictionary<string, CustomFieldsList> CustomFieldDictById
        {
            get
            {
                return _CustomFieldDictById;
            }
        }

        public static void PopulateCustomFieldIds(string fieldIdsPath)
        {
            List<CustomFieldsList> allCustomFields = Enum.GetValues(typeof(CustomFieldsList)).Cast<CustomFieldsList>().ToList();
            _CustomFieldDictById = new Dictionary<string, CustomFieldsList>();
            _CustomFieldDictByName = new Dictionary<CustomFieldsList, string>();
            using (StreamReader file = File.OpenText(fieldIdsPath))
            {
                using (JsonTextReader reader = new JsonTextReader(file))
                {
                    JObject fileContent = (JObject)JToken.ReadFrom(reader);
                    List<JToken> fieldDefinitions = fileContent["ticketFields"].Children().ToList();
                    foreach (var fieldDefinition in fieldDefinitions)
                    {
                        foreach (CustomFieldsList field in allCustomFields)
                        {
                            if (fieldDefinition["name"].ToString().Equals(field.ToString(), StringComparison.CurrentCultureIgnoreCase))
                            {
                                string fieldId = fieldDefinition["id"].ToString();
                                if (!_CustomFieldDictByName.ContainsKey(field))
                                {
                                    _CustomFieldDictByName.Add(field, fieldId);
                                }
                                if (!_CustomFieldDictById.ContainsKey(fieldId))
                                {
                                    _CustomFieldDictById.Add(fieldId, field);
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }

        public static string GetFieldId(CustomFieldsList field)
        {
            if (_CustomFieldDictByName != null && _CustomFieldDictByName.ContainsKey(field))
            {
                return _CustomFieldDictByName[field];
            }
            else
            {
                throw new InvalidDataException("There is no ID defined for custom field " + field.ToString());
            }
        }

    }
}
